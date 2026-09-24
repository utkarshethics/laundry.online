# laundry.online

Doorstep laundry & dry cleaning website — **laundry.online**. Static marketing site with service pricing, online booking modal, testimonials, FAQs and contact/franchise pages.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page: hero, pricing, how it works, promises, testimonials, FAQs, franchise CTA |
| `about.html` | About / story / promise |
| `contact.html` | Contact details, franchise enquiry + contact form |

## Local preview

```bash
npx serve .          # or: python3 -m http.server 8000
```

## Deploy

Hosted on **Cloudflare Pages** (static output, no build step).

```bash
npx wrangler pages deploy . --project-name laundry-online
```

- **Repo:** https://github.com/utkarshethics/laundry.online
- **Live:** https://laundry-online.pages.dev

## Tech

- Vanilla HTML / CSS / JS — no framework, no build step.
