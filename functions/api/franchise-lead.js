/**
 * Franchise enquiry capture.
 *
 * POST /api/franchise-lead  ->  validated, de-spammed, then filed as an issue
 * in the leads-db GitHub repository, which is the CRM the Razorpay webhook
 * already writes to (functions/api/webhook.js). Both land in the same repo
 * under different labels, so a franchise enquiry and a payment sit side by
 * side for the same business.
 *
 * Requires a LEAD_TOKEN secret with `repo` scope on utkarshethics/leads-db:
 *   npx wrangler pages secret put LEAD_TOKEN --project-name laundry-online
 *
 * Optional KV binding named EVENTS, used for de-duplication and rate limiting.
 * Without it the endpoint still works; it just cannot suppress repeats.
 */

const CRM_REPO = "utkarshethics/leads-db";
const SOURCE = "https://laundary.online/franchise.html";
const BUSINESS = "Franchise";

/** Hard caps so a single request cannot bloat an issue body. */
const MAX = { name: 80, phone: 20, city: 60, email: 120, message: 2000 };
const WINDOW_SECONDS = 3600;
const MAX_LEADS_PER_WINDOW = 5;

/** Number of identical leads (same phone) we tolerate inside the window. */
const MAX_PER_PHONE = 2;

/**
 * Cities the page offers. This list and the <select> in franchise.html must
 * stay identical: a mismatch rejects every applicant who picks the other
 * spelling, so js/franchise.js compares the two at runtime and warns.
 */
const CITIES = [
  "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Nagpur", "Other",
];

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function clip(value, max) {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > max ? s.slice(0, max) : s;
}

/** Strips control characters and markdown-ish noise before it reaches a ticket. */
function clean(value, max) {
  return clip(value, max).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ");
}

/**
 * The lead message is interpolated into a markdown issue body. Without this, a
 * visitor could paste @octocat and GitHub would email that user, so mentions
 * are defanged. Everything else is left readable.
 */
function defangMentions(text) {
  return text.replace(/@/g, "@\u200B");
}

/**
 * Indian mobile numbers, tolerant of the shapes people actually type:
 * 10 digits, +91/91 prefixed, or 0-prefixed with a space or dash.
 */
function normalisePhone(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function isValidPhone(digits) {
  if (digits.length !== 10) return false;
  // Indian mobile numbers start 6-9. Reject the 0-5 range, which is where
  // typo'd landlines and padded values land.
  if (!/^[6-9]/.test(digits)) return false;
  return !/^(\d)\1{9}$/.test(digits);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readCounter(kv, key) {
  if (!kv) return null;
  const raw = await kv.get(key, "json").catch(() => null);
  return Array.isArray(raw) ? raw : null;
}

/** Appends now to a timestamp list, dropping entries that fell out of window. */
function bump(timestamps) {
  const now = Date.now();
  const cut = now - WINDOW_SECONDS * 1000;
  return [...(timestamps || []).filter((t) => t > cut), now];
}

/**
 * Returns true when this phone has already used up its allowance, or when the
 * IP has sent too many leads. Counters are only written once a lead passes
 * validation, so a rejected payload does not burn an honest visitor's quota.
 */
async function isRateLimited(env, phone, ip) {
  const kv = env.EVENTS;
  if (!kv) return false;

  const phoneKey = `franchise:phone:${phone}`;
  const ipKey = ip ? `franchise:ip:${await sha256Hex(ip)}` : null;

  const phoneStamps = (await readCounter(kv, phoneKey)) || [];
  const ipStamps = ipKey ? (await readCounter(kv, ipKey)) || [] : [];

  if (phoneStamps.length >= MAX_PER_PHONE) return true;
  if (ipKey && ipStamps.length >= MAX_LEADS_PER_WINDOW) return true;

  const ttl = WINDOW_SECONDS * 2;
  await kv.put(phoneKey, JSON.stringify(bump(phoneStamps)), { expirationTtl: ttl });
  if (ipKey) await kv.put(ipKey, JSON.stringify(bump(ipStamps)), { expirationTtl: ttl });

  return false;
}

async function fileCrmIssue(env, lead) {
  const token = env.LEAD_TOKEN || "";
  if (!token) return { ok: false, reason: "no-token" };

  const title = `[${BUSINESS}] ${lead.city} · ${lead.phone} · ₹1 Lakh Partner`;

  const body = [
    `**Source:** ${SOURCE}`,
    `**Received:** ${lead.received_at}`,
    "",
    `**Name:** ${lead.name}`,
    `**Phone:** ${lead.phone}`,
    `**Email:** ${lead.email || "n/a"}`,
    `**Preferred city:** ${lead.city}`,
    `**Investment capacity:** ${lead.capacity}`,
    `**Timeline:** ${lead.timeline}`,
    `**Property / outlet:** ${lead.property || "n/a"}`,
    "",
    "**Message**",
    "",
    lead.message ? defangMentions(lead.message) : "_No message submitted._",
    "",
    "---",
    `\`${lead.id}\``,
  ].join("\n");

  const res = await fetch(`https://api.github.com/repos/${CRM_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "laundry-online-franchise-lead",
    },
    body: JSON.stringify({
      title,
      body,
      labels: [BUSINESS, "Leads", "Website"],
    }),
  });

  if (res.ok) {
    const issue = await res.json().catch(() => ({}));
    return { ok: true, number: issue.number, url: issue.html_url };
  }

  // Do not log the token or the upstream body verbatim; the status is enough
  // to tell a permissions failure apart from a rate limit.
  console.error("FRANCHISE_CRM_FAILED", res.status);
  return { ok: false, reason: `http-${res.status}` };
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const origin = request.headers.get("origin") || "";
  const allowed = (env) => {
    const hosts = String(env.FRANCHISE_ALLOWED_ORIGINS || "https://laundary.online,https://www.laundary.online")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return hosts.length === 0 || hosts.includes(origin);
  };

  // Same-origin browser posts always carry Origin. A missing Origin is a curl
  // or a server-to-server caller, which is not a CSRF case, so it is allowed.
  if (origin && !allowed(context.env)) {
    return json({ error: "Origin not allowed" }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // Honeypot. Real users never see this field, so any value is a bot.
  if (clip(payload.website, 100)) {
    return json({ ok: true, id: "accepted" }, 202);
  }

  const name = clean(payload.name, MAX.name);
  const phone = normalisePhone(payload.phone);
  const email = clean(payload.email, MAX.email).toLowerCase();
  const city = clean(payload.city, MAX.city);
  const capacity = clean(payload.capacity, 40);
  const timeline = clean(payload.timeline, 40);
  const property = clean(payload.property, MAX.city);
  const message = clean(payload.message, MAX.message);

  const errors = [];
  if (name.length < 2) errors.push("name is required");
  if (!isValidPhone(phone)) errors.push("a valid 10-digit Indian mobile number is required");
  if (email && !isValidEmail(email)) errors.push("email is not a valid address");
  if (city.length < 2) errors.push("city is required");
  if (!CITIES.some((c) => c.toLowerCase() === city.toLowerCase())) errors.push("unknown city");
  if (!capacity) errors.push("investment capacity is required");

  if (errors.length) {
    return json({ error: "Please correct the highlighted fields", fields: errors }, 422);
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "";

  if (await isRateLimited(context.env, phone, ip)) {
    // Deliberately shaped like success so an automated submitter cannot use
    // the response to tell that it was throttled.
    return json({ ok: true, id: "accepted" }, 202);
  }

  // Random suffix as well as the phone and clock: two submits from the same
  // number inside one millisecond would otherwise share a reference id.
  const id = `f-${(await sha256Hex(`${phone}:${Date.now()}:${crypto.randomUUID()}`)).slice(0, 12)}`;
  const lead = {
    id,
    name,
    phone,
    email,
    city,
    capacity,
    timeline: timeline || "Not stated",
    property,
    message,
    received_at: new Date().toISOString(),
  };

  console.log("FRANCHISE_LEAD", JSON.stringify({ ...lead, message: lead.message.slice(0, 200) }));

  // Belt and braces: KV is the fallback record when the CRM token is missing
  // or GitHub is down, so an enquiry is never silently dropped.
  const kv = context.env.EVENTS;
  if (kv) {
    await kv.put(`franchise:lead:${id}`, JSON.stringify(lead)).catch(() => {});
  }

  const crm = await fileCrmIssue(context.env, lead);

  if (!crm.ok) {
    // Persisted in KV and visible in logs, so still a success from the
    // visitor's point of view.
    return json({ ok: true, id, crm_published: false, crm_reason: crm.reason }, 200);
  }

  return json({ ok: true, id, crm_published: true, crm_issue: crm.number }, 200);
}