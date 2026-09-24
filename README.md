# laundry.online

Doorstep laundry & dry cleaning website — **laundry.online**. Static marketing site with service pricing, online booking modal, ₹50 advance booking via Razorpay, webhooks, testimonials, FAQs and contact/franchise pages.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page: hero, pricing, advance booking CTA, how it works, promises, testimonials, FAQs, franchise CTA |
| `about.html` | About / story / promise |
| `contact.html` | Contact details, franchise enquiry + contact form |
| `functions/api/webhook.js` | Cloudflare Pages Function that receives Razorpay webhooks |
| `docs/webhooks.md` | Razorpay webhook setup guide |

## ₹50 Advance Booking

Every "₹50" CTA points to the Razorpay payment link:

```
https://razorpay.com/payment-link/plink_TfrpceYFPIv3Ch
```

Placed in: hero, dedicated advance-booking section, and the booking modal.

## Webhooks

`POST https://laundry-online.pages.dev/api/webhook` handles `payment_link.paid`, `payment.captured` and `payment.failed` events with HMAC-SHA256 signature verification. Full setup: see **docs/webhooks.md**.

## Local preview

```bash
npx serve .          # or: python3 -m http.server 8000
```

## Deploy

Hosted on **Cloudflare Pages** (static output, no build step; Pages Functions only for `/api/webhook`).

```bash
npx wrangler pages secret put RAZORPAY_WEBHOOK_SECRET --project-name laundry-online
npx wrangler pages deploy . --project-name laundry-online
```

- **Repo:** https://github.com/utkarshethics/laundry.online
- **Live:** https://laundry-online.pages.dev

## Tech

- Vanilla HTML / CSS / JS — no framework, no build step.
- Cloudflare Pages Functions for the webhook endpoint.
