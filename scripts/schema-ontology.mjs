#!/usr/bin/env node
/**
 * Inject an interlinked Schema.org entity graph into the laundary.online pages.
 *
 * The pages previously carried a single flat LocalBusiness object with no
 * @id, so search engines saw one anonymous blob per page. The same business
 * was re-declared differently on each page and nothing referenced anything
 * else. This emits one @graph per page where every node has a stable, page-
 * independent @id and the nodes are wired together by reference, so the
 * business, site, service catalogue and pages resolve to shared entities.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ORIGIN = 'https://laundary.online';
const PHONE = '+9190909090';
const WHATSAPP = 'https://wa.me/9190909090';
const IMAGE = `${ORIGIN}/assets/og-image.png`;
const CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur',
];

/**
 * Entities that are identical on every page. They are emitted with @ids that
 * do not contain a page path, so all three pages resolve to the same
 * organization / website / business / catalogue nodes.
 */
const globalEntities = () => [
  {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: 'laundry.online',
    url: `${ORIGIN}/`,
    logo: { '@id': `${ORIGIN}/#logo` },
    image: { '@id': `${ORIGIN}/#logo` },
    description:
      'Doorstep laundry and dry cleaning service offering free pickup and delivery across major Indian cities.',
    sameAs: [WHATSAPP],
    contactPoint: { '@id': `${ORIGIN}/#contactpoint` },
  },
  {
    '@type': 'ContactPoint',
    '@id': `${ORIGIN}/#contactpoint`,
    telephone: PHONE,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
    url: `${ORIGIN}/contact.html`,
  },
  {
    '@type': 'ImageObject',
    '@id': `${ORIGIN}/#logo`,
    url: IMAGE,
    contentUrl: IMAGE,
    width: 1200,
    height: 630,
    caption: 'laundry.online',
  },
  {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: 'laundry.online',
    description: 'Laundry and dry cleaning at your doorstep with free pick and drop.',
    inLanguage: 'en-IN',
    publisher: { '@id': `${ORIGIN}/#organization` },
  },
  {
    '@type': ['LocalBusiness', 'DryCleaningOrLaundry'],
    '@id': `${ORIGIN}/#localbusiness`,
    name: 'laundry.online',
    url: `${ORIGIN}/`,
    image: { '@id': `${ORIGIN}/#logo` },
    logo: { '@id': `${ORIGIN}/#logo` },
    description:
      'Professional laundry, dry cleaning, wash and fold, and express laundry services with free doorstep pickup and delivery.',
    priceRange: '₹50-₹999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Cards',
    parentOrganization: { '@id': `${ORIGIN}/#organization` },
    areaServed: CITIES.map((name) => ({ '@type': 'City', name })),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '06:00',
      closes: '19:00',
    }],
    hasOfferCatalog: { '@id': `${ORIGIN}/#service` },
    sameAs: [WHATSAPP],
  },
  {
    '@type': 'OfferCatalog',
    '@id': `${ORIGIN}/#service`,
    name: 'Laundry and dry cleaning services',
    provider: { '@id': `${ORIGIN}/#localbusiness` },
    itemListElement: [
      ['Wash and fold', 'Everyday laundry washed, dried and folded.'],
      ['Dry cleaning', 'Specialist dry cleaning for delicate and premium fabrics.'],
      ['Ironing and pressing', 'Steam pressing and finishing for a crease-free result.'],
      ['Curtain cleaning', 'Heavy-duty cleaning for curtains and drapery.'],
      ['Bedsheet cleaning', 'Bedsheet and linen washing with free pickup and delivery.'],
      ['Express service', 'Priority turnaround for urgent orders.'],
    ].map(([name, description], i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: { '@type': 'Service', name, description },
    })),
  },
];

/** Per-page nodes. `path` must match the file the block is injected into. */
const pages = [
  {
    file: 'index.html',
    path: '/',
    type: 'CollectionPage',
    name: 'Laundry and Dry Cleaning at Your Doorstep | Free Pick & Drop',
    description:
      'Professional laundry, dry cleaning, wash & fold and express laundry with free doorstep pickup and delivery.',
  },
  {
    file: 'about.html',
    path: '/about.html',
    type: 'AboutPage',
    name: 'About laundry.online',
    description: 'Who we are and how our doorstep laundry and dry cleaning service works.',
  },
  {
    file: 'contact.html',
    path: '/contact.html',
    type: 'ContactPage',
    name: 'Contact laundry.online',
    description: 'Book a free laundry pickup and delivery, or reach our customer service team.',
  },
];

/** Ancestor trail used to build each page's BreadcrumbList. */
function crumbs(path) {
  const trail = [{ name: 'Home', url: `${ORIGIN}/` }];
  const file = path.split('/').pop();
  if (file) trail.push({ name: file.replace('.html', '').replace(/^\w/, (c) => c.toUpperCase()), url: `${ORIGIN}${path}` });
  return trail;
}

function graphFor(page) {
  const url = page.path === '/' ? `${ORIGIN}/` : `${ORIGIN}${page.path}`;
  const trail = crumbs(page.path);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...globalEntities(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.name,
        description: page.description,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#localbusiness` },
        primaryImageOfPage: { '@id': `${ORIGIN}/#logo` },
        inLanguage: 'en-IN',
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      ...(page.type !== 'WebPage' ? [{
        '@type': page.type,
        '@id': `${url}#webpage`,
        url,
        name: page.name,
        description: page.description,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#localbusiness` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-IN',
      }] : []),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: trail.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      },
    ],
  };
}

const BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g;

for (const page of pages) {
  const file = resolve(process.cwd(), page.file);
  let html = readFileSync(file, 'utf8');
  const before = html;

  // Remove every existing ld+json block, then insert exactly one graph.
  html = html.replace(BLOCK, '');
  const block = `<script type="application/ld+json">\n${JSON.stringify(graphFor(page), null, 2)}\n</script>\n`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${block}</head>`);
  } else {
    html = block + html;
  }

  writeFileSync(file, html);
  const count = (html.match(/application\/ld\+json/g) || []).length;
  const nodes = JSON.parse(block.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'].length;
  console.log(`  ${page.file}: ${nodes} nodes, ${count} ld+json block(s)${before === html ? '' : ''}`);
}

console.log('Schema graph injected. Re-running replaces in place (idempotent).');
