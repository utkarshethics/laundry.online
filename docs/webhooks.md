# Razorpay Webhooks — Setup

If you have a website, database, or backend system, you can set up Webhooks to receive automated HTTP POST notifications from Razorpay.

## 1. Add the webhook in the Razorpay Dashboard

1. Navigate to **Settings → Webhooks → Add New Webhook**.
2. Enter the **Webhook URL**:
   ```
   https://laundry-online.pages.dev/api/webhook
   ```
3. Enter a **secret** (you'll use it to verify signatures — store it as `RAZORPAY_WEBHOOK_SECRET`).
4. **Subscribe to events**:
   - `payment_link.paid` — triggers when the payment link is fully paid (your ₹50 advance booking).
   - `payment.captured` — triggers when funds are captured successfully.
   - `payment.failed` — triggers if a customer's payment attempt fails.

## 2. How the endpoint verifies requests

`functions/api/webhook.js` (a Cloudflare Pages Function):

- Only accepts `POST`.
- Reads the `X-Razorpay-Signature` header.
- Computes HMAC-SHA256 of `"{timestamp}.{body}"` with your secret (and falls back to the legacy `HMAC(body)` form).
- Compares signatures in constant time; rejects mismatches with `401`.
- Parses the payload and handles the three subscribed events.

## 3. Set the secret on Cloudflare

The secret is read from an environment variable — never commit it to the repo.

```bash
npx wrangler pages secret put RAZORPAY_WEBHOOK_SECRET --project-name laundry-online
```

Paste the same secret you configured in the Razorpay Dashboard.

## 4. Optional: store recent events in KV

Create a KV namespace and bind it as `EVENTS` to persist the last 50 webhook events.

```bash
npx wrangler kv namespace create EVENTS
```

Add to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "EVENTS"
id = "<your-namespace-id>"
```

Redeploy:

```bash
npx wrangler pages deploy . --project-name laundry-online --branch=main
```

## 5. Test the webhook

In **Razorpay Dashboard → Settings → Webhooks**, select your webhook and click **Test** / **Send test event** to fire `payment_link.paid`. A successful response looks like:

```json
{ "ok": true, "event": "payment_link.paid", "amount_inr": "50.00" }
```

Live events appear in the Pages Function logs (`wrangler pages deployment tail`).