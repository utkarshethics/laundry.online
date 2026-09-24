# AGENTS.md — AI Agent Guidance & Project Context

## 1. CRITICAL: Credential Rules & Anti-Hallucination Directives

> **MANDATORY INSTRUCTION FOR ALL AI AGENTS:**
> - **DO NOT HALLUCINATE MISSING API KEYS OR CREDENTIALS.**
> - All required API credentials for GoDaddy and Cloudflare are active, verified, and stored locally in this project's `.env`, in `~/.zshenv`, and in `~/.config/opencode/INSTRUCTIONS.md`.
> - **NEVER query database session transcripts and rely on earlier AI chat comments or flawed assumptions to declare that a key doesn't exist.**
> - Always read the environment variables or `.env` file first.
> - Verify credentials against the live API before reporting any issues to the user.

---

## 2. API Credentials & Integration Details

### GoDaddy API
- **Environment Variables**: `$GODADDY_API_KEY`, `$GODADDY_API_SECRET` (loaded from `.env` or `~/.zshenv`)
- **Auth Header**: `Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`
- **Live Endpoint Test**:
  ```bash
  curl -s -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" https://api.godaddy.com/v1/domains
  ```
- **Registered Domain**: `laundary.online` (Domain ID: `477148246`, Status: `ACTIVE`)
- **Note**: The GoDaddy API key may sometimes be pasted with the UI prefix `"Key"`. Strip the leading `"Key"` if present (the actual key starts with `AQFPH...`). **NEVER confuse GoDaddy credentials with Razorpay!**

### Cloudflare API
- **Environment Variables**: `$CLOUDFLARE_API_TOKEN`, `$CF_TOKEN`, `$CLOUDFLARE_ACCOUNT_ID` (loaded from `.env` or `~/.zshenv`)
- **Zone for laundary.online**: `5c7f91ca7ce5aad154c907001474c832`
- **Assigned Cloudflare Nameservers**:
  - `kianchau.ns.cloudflare.com`
  - `summer.ns.cloudflare.com`
- **Cloudflare Pages Project**: `laundry-online` (URL: `https://laundry-online.pages.dev`)

### Razorpay Integration
- **Advance Booking Payment Link**: `https://razorpay.com/payment-link/plink_TfrpceYFPIv3Ch`
- **Webhook Endpoint**: `https://laundry-online.pages.dev/api/webhook`
- **Webhook Secret (`RAZORPAY_WEBHOOK_SECRET`)**:
  - When the user configures webhooks in Razorpay Dashboard (Settings → Webhooks), the secret they choose should be uploaded to Pages:
    ```bash
    npx wrangler pages secret put RAZORPAY_WEBHOOK_SECRET --project-name laundry-online
    ```
  - **DO NOT** use the GoDaddy Secret as the Razorpay secret!

---

## 3. Current Infrastructure State

1. **Domain Nameservers (GoDaddy)**:
   - Updated to Cloudflare's nameservers (`kianchau.ns.cloudflare.com`, `summer.ns.cloudflare.com`).
2. **Cloudflare DNS**:
   - `laundary.online` CNAME → `laundry-online.pages.dev` (proxied)
   - `www.laundary.online` CNAME → `laundry-online.pages.dev` (proxied)
3. **Deployment**:
   - Site deployed to Cloudflare Pages project `laundry-online`.
   - Webhook function at `functions/api/webhook.js`.
