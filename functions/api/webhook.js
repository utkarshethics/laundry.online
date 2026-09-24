const encoder = new TextEncoder();

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hexHmac(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const CRM_REPO = "utkarshethics/leads-db";
const BUSINESS = "Laundry";
const PAID_EVENTS = ["payment_link.paid", "payment.captured"];

function ownsLink(env, linkId) {
  const ids = (env.LAUNDRY_LINK_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) return false;
  return ids.includes(linkId);
}

function parseEvent(payload) {
  const event = payload.event || "";
  const data = payload.payload || {};

  let amount = null;
  let status = null;
  let entityId = null;
  let linkId = null;
  let contact = "";

  if (data.payment && data.payment.entity) {
    const p = data.payment.entity;
    amount = p.amount;
    status = p.status;
    entityId = p.id;
    contact = (p.customer && p.customer.contact) || "";
  } else if (data.payment_link && data.payment_link.entity) {
    const pl = data.payment_link.entity;
    amount = pl.amount;
    status = pl.status;
    entityId = pl.id;
    linkId = pl.id;
    contact = (pl.customer && pl.customer.contact) || "";
  }

  if (data.payment_link && data.payment_link.entity) {
    linkId = data.payment_link.entity.id;
  }

  const amountInr = amount != null ? (amount / 100).toFixed(2) : null;

  return {
    event,
    id: entityId,
    status,
    amount_inr: amountInr,
    link_id: linkId,
    contact,
    created_at: new Date().toISOString(),
  };
}

async function recordCrmIssue(env, parsed) {
  const token = env.LEAD_TOKEN || "";
  if (!token) return false;

  const paid = PAID_EVENTS.includes(parsed.event);
  const title = paid
    ? `[${BUSINESS}] Payment ${paid ? "Received" : "Failed"} — ₹${parsed.amount_inr || "0.00"}`
    : `[${BUSINESS}] Payment Failed — ₹${parsed.amount_inr || "0.00"}`;
  const body = [
    `Business: ${BUSINESS}`,
    `Event: ${parsed.event}`,
    `Payment ID: ${parsed.id || "n/a"}`,
    `Payment Link: ${parsed.link_id || "n/a"}`,
    `Amount: ₹${parsed.amount_inr || "0.00"}`,
    `Customer Contact: ${parsed.contact || "n/a"}`,
    `Status: ${parsed.status || "n/a"}`,
    `Recorded: ${parsed.created_at}`,
  ].join("\n\n");

  const res = await fetch(`https://api.github.com/repos/${CRM_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "laundry-online-webhook",
    },
    body: JSON.stringify({ title, body, labels: [BUSINESS, "Payments", paid ? "Paid" : "Payment-Failed"] }),
  });
  return res.ok;
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secret = context.env.RAZORPAY_WEBHOOK_SECRET || "";
  if (!secret) {
    return json({ error: "RAZORPAY_WEBHOOK_SECRET env var is not set" }, 500);
  }

  const body = await request.text();
  const sigHeader = request.headers.get("x-razorpay-signature") || "";

  const [timestamp, hexSig] = sigHeader.split(".");
  const expected = hexSig != null ? await hexHmac(secret, `${timestamp}.${body}`) : null;
  const expectedLegacy = await hexHmac(secret, body);

  const valid =
    (expected != null && constantTimeEqual(expected, hexSig)) ||
    constantTimeEqual(expectedLegacy, sigHeader);

  if (!valid) {
    return json({ error: "Invalid webhook signature" }, 401);
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = parseEvent(payload);
  const supported = ["payment_link.paid", "payment.captured", "payment.failed"];

  if (!supported.includes(parsed.event)) {
    return json({ ok: true, event: parsed.event, ignored: true }, 200);
  }

  if (parsed.link_id && !ownsLink(context.env, parsed.link_id)) {
    return json({ ok: true, event: parsed.event, owned: false }, 200);
  }

  console.log("RAZORPAY_WEBHOOK", JSON.stringify(parsed));

  const kv = context.env.EVENTS;
  if (kv) {
    await kv.put(parsed.event, JSON.stringify(parsed));
    const events = await kv.get("recent", "json").catch(() => []);
    const list = Array.isArray(events) ? events : [];
    list.unshift(parsed);
    await kv.put("recent", JSON.stringify(list.slice(0, 50)));
  }

  const crmOk = await recordCrmIssue(context.env, parsed);

  return json({ ok: true, event: parsed.event, amount_inr: parsed.amount_inr, crm_published: crmOk });
}