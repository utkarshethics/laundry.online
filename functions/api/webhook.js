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

function parseEvent(payload) {
  const event = payload.event || "";
  const data = payload.payload || {};

  let amount = null;
  let status = null;
  let entityId = null;

  if (data.payment && data.payment.entity) {
    const p = data.payment.entity;
    amount = p.amount;
    status = p.status;
    entityId = p.id;
  } else if (data.payment_link && data.payment_link.entity) {
    const pl = data.payment_link.entity;
    amount = pl.amount;
    status = pl.status;
    entityId = pl.id;
  }

  const amountInr = amount != null ? (amount / 100).toFixed(2) : null;

  return {
    event,
    id: entityId,
    status,
    amount_inr: amountInr,
    created_at: new Date().toISOString(),
  };
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

  console.log("RAZORPAY_WEBHOOK", JSON.stringify(parsed));

  const kv = context.env.EVENTS;
  if (kv) {
    await kv.put(parsed.event, JSON.stringify(parsed));
    const events = await kv.get("recent", "json").catch(() => []);
    const list = Array.isArray(events) ? events : [];
    list.unshift(parsed);
    await kv.put("recent", JSON.stringify(list.slice(0, 50)));
  }

  return json({ ok: true, event: parsed.event, amount_inr: parsed.amount_inr });
}