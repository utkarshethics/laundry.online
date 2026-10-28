/**
 * Cloudflare Pages middleware: edge HTML enhancement for laundary.online
 *
 * Runs on every request and only rewrites successful HTML responses:
 *  - loads /js/enhance.js (smooth scroll, scroll reveal, microinteractions,
 *    exit-intent popup) with this site's settings
 *  - lazy-loads images below the first two, adds async decoding
 *  - adds Open Graph / Twitter card tags to pages that are missing them
 *  - appends a "Popular searches" keyword row inside the footer
 * Everything else (API routes, assets, redirects) passes through untouched.
 */

const SITE_NAME = 'laundry.online';
const OG_IMAGE = 'https://laundary.online/assets/og-image.webp';

const ENHANCE_SETTINGS = {
  exitIntent: {
    title: 'Free pickup & drop today',
    text: 'Book a doorstep laundry pickup in under a minute. Express 24-hour option available.',
    ctaText: 'Book on WhatsApp',
    ctaHref: 'https://wa.me/917892240243?text=' + encodeURIComponent("Hi, I'd like to book a laundry pickup"),
    skipPaths: ['/book', '/contact', '/privacy', '/terms']
  },
  language: { enabled: false }
};

const FOOTER_KEYWORDS = [
  ['Laundry service in Bengaluru', '/'],
  ['Laundry pickup and delivery', '/book'],
  ['Dry cleaning near me', '/#services'],
  ['Wash and fold service', '/#services'],
  ['Wash and iron', '/#services'],
  ['Express laundry in 24 hours', '/#services'],
  ['Shoe cleaning service', '/#services'],
  ['Blanket and curtain cleaning', '/#services'],
  ['Laundry price list', '/pricing'],
  ['Laundry in Indiranagar', '/contact']
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FOOTER_KEYWORDS_HTML =
  '<nav aria-label="Popular searches" class="footer-keywords" style="max-width:1240px;margin:20px auto 0;padding:14px 24px 0;border-top:1px solid rgba(127,127,127,.25)">' +
  '<div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.6;margin-bottom:6px">Popular searches</div>' +
  FOOTER_KEYWORDS.map(([t, u]) =>
    `<a href="${esc(u)}" style="color:inherit;opacity:.72;text-decoration:none;font-size:13px;line-height:1.9;margin:0 14px 0 0;display:inline-block">${esc(t)}</a>`
  ).join('') +
  '</nav>';

const ENHANCE_TAGS =
  `<script>window.SITE_ENHANCE=${JSON.stringify(ENHANCE_SETTINGS)};</script>` +
  '<script src="/js/enhance.js" defer></script>';

export async function onRequest(context) {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (response.status !== 200 || !type.includes('text/html')) return response;

  const page = { title: '', description: '', canonical: '', hasOg: false, hasTwitter: false };
  let imgCount = 0;
  let footerDone = false;

  return new HTMLRewriter()
    .on('title', { text(t) { page.title += t.text; } })
    .on('meta[name="description"]', { element(el) { page.description = el.getAttribute('content') || ''; } })
    .on('link[rel="canonical"]', { element(el) { page.canonical = el.getAttribute('href') || ''; } })
    .on('meta[property="og:title"]', { element() { page.hasOg = true; } })
    .on('meta[name="twitter:card"]', { element() { page.hasTwitter = true; } })
    .on('head', {
      element(el) {
        el.onEndTag((end) => {
          if (!page.title) return;
          const title = esc(page.title.trim().replace(/&amp;/g, '&'));
          const desc = esc(page.description.replace(/&amp;/g, '&'));
          let tags = '';
          if (!page.hasOg) {
            tags += `<meta property="og:type" content="website"><meta property="og:site_name" content="${SITE_NAME}">` +
              `<meta property="og:title" content="${title}">` +
              (desc ? `<meta property="og:description" content="${desc}">` : '') +
              (page.canonical ? `<meta property="og:url" content="${esc(page.canonical)}">` : '') +
              `<meta property="og:image" content="${OG_IMAGE}">`;
          }
          if (!page.hasTwitter) {
            tags += '<meta name="twitter:card" content="summary_large_image">' +
              `<meta name="twitter:title" content="${title}">` +
              (desc ? `<meta name="twitter:description" content="${desc}">` : '') +
              `<meta name="twitter:image" content="${OG_IMAGE}">`;
          }
          if (tags) end.before(tags, { html: true });
        });
      }
    })
    .on('img', {
      element(el) {
        imgCount += 1;
        if (!el.getAttribute('decoding')) el.setAttribute('decoding', 'async');
        if (imgCount > 2 && !el.getAttribute('loading')) el.setAttribute('loading', 'lazy');
      }
    })
    .on('footer', {
      element(el) {
        if (footerDone) return;
        footerDone = true;
        el.append(FOOTER_KEYWORDS_HTML, { html: true });
      }
    })
    .on('body', { element(el) { el.append(ENHANCE_TAGS, { html: true }); } })
    .transform(response);
}
