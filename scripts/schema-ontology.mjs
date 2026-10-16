#!/usr/bin/env node
/**
 * Knowledge Graph, Ontology & JSON-LD Entity Graph Generator for laundry.online
 * 
 * Provides complete GEO (Generative Engine Optimization) and LLMO structured metadata.
 * Injects interconnected Schema.org @graph with canonical Wikidata entity alignments,
 * semantic triples, and verified business facts across all HTML pages.
 * Also emits a root ontology.json semantic map for AI search retrieval.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ORIGIN = 'https://laundary.online';
const CANONICAL_BRAND = 'laundry.online';
const PHONE = '+91-7892240243';
const PHONE_INTL = '+917892240243';
const WHATSAPP = 'https://wa.me/917892240243';
const SUPPORT_EMAIL = 'support@laundry.online';
const IMAGE = `${ORIGIN}/assets/og-image.png`;

const CITIES = [
  { name: 'Mumbai', sameAs: 'https://www.wikidata.org/wiki/Q1156' },
  { name: 'Pune', sameAs: 'https://www.wikidata.org/wiki/Q1538' },
  { name: 'Bengaluru', sameAs: 'https://www.wikidata.org/wiki/Q1355' },
  { name: 'Delhi NCR', sameAs: 'https://www.wikidata.org/wiki/Q1353' },
  { name: 'Hyderabad', sameAs: 'https://www.wikidata.org/wiki/Q1361' },
  { name: 'Chennai', sameAs: 'https://www.wikidata.org/wiki/Q1352' },
  { name: 'Kolkata', sameAs: 'https://www.wikidata.org/wiki/Q1348' },
  { name: 'Ahmedabad', sameAs: 'https://www.wikidata.org/wiki/Q1191' },
  { name: 'Jaipur', sameAs: 'https://www.wikidata.org/wiki/Q132682' },
  { name: 'Thane', sameAs: 'https://www.wikidata.org/wiki/Q207749' },
  { name: 'Noida', sameAs: 'https://www.wikidata.org/wiki/Q204439' },
  { name: 'Gurgaon', sameAs: 'https://www.wikidata.org/wiki/Q12620' },
];

const KNOWS_ABOUT = [
  {
    '@type': 'DefinedTerm',
    name: 'Dry Cleaning',
    sameAs: 'https://www.wikidata.org/wiki/Q841364',
  },
  {
    '@type': 'DefinedTerm',
    name: 'Laundry',
    sameAs: 'https://www.wikidata.org/wiki/Q849495',
  },
  {
    '@type': 'DefinedTerm',
    name: 'Washing Machine',
    sameAs: 'https://www.wikidata.org/wiki/Q124441',
  },
  {
    '@type': 'DefinedTerm',
    name: 'Ironing',
    sameAs: 'https://www.wikidata.org/wiki/Q1224850',
  },
  {
    '@type': 'DefinedTerm',
    name: 'Stain Removal',
    sameAs: 'https://www.wikidata.org/wiki/Q7597148',
  },
  {
    '@type': 'DefinedTerm',
    name: 'Fabric Care & Garment Maintenance',
    sameAs: 'https://www.wikidata.org/wiki/Q11084206',
  },
];

const SERVICES_CATALOG = [
  {
    id: `${ORIGIN}/#service-wash-fold`,
    name: 'Wash & Fold Laundry Service',
    description: 'Everyday laundry washed in calibrated eco-detergent, tumble-dried and neatly folded per kilogram.',
    serviceType: 'Wash and Fold Laundry',
    price: '69',
    unitText: 'kg',
    wikidata: 'https://www.wikidata.org/wiki/Q849495',
  },
  {
    id: `${ORIGIN}/#service-wash-iron`,
    name: 'Wash & Steam Iron Service',
    description: 'Complete laundry washed, dried, steam ironed and crease-free packaged on hangers or folded.',
    serviceType: 'Wash and Iron',
    price: '99',
    unitText: 'kg',
    wikidata: 'https://www.wikidata.org/wiki/Q1224850',
  },
  {
    id: `${ORIGIN}/#service-dry-cleaning`,
    name: 'Professional Eco Dry Cleaning',
    description: 'Expert fabric-safe dry cleaning for suits, blazers, silk sarees, lehengas, jackets, and delicate designer garments.',
    serviceType: 'Dry Cleaning',
    price: '149',
    unitText: 'piece',
    wikidata: 'https://www.wikidata.org/wiki/Q841364',
  },
  {
    id: `${ORIGIN}/#service-steam-press`,
    name: 'Steam Pressing & Ironing',
    description: 'Commercial high-pressure steam pressing removing deep wrinkles for crisp formal wear and ethnic outfits.',
    serviceType: 'Steam Pressing',
    price: '29',
    unitText: 'piece',
    wikidata: 'https://www.wikidata.org/wiki/Q1224850',
  },
  {
    id: `${ORIGIN}/#service-express`,
    name: '24-Hour Express Laundry & Dry Cleaning',
    description: 'Priority turnaround laundry and dry cleaning processed and delivered to customer doorsteps in 24 hours.',
    serviceType: 'Express Laundry',
    price: '149',
    unitText: 'order',
    wikidata: 'https://www.wikidata.org/wiki/Q849495',
  },
  {
    id: `${ORIGIN}/#service-curtain-cleaning`,
    name: 'Curtain & Drapery Cleaning',
    description: 'Deep extraction and gentle washing or dry cleaning for heavy window curtains, drapes, and sheer fabrics.',
    serviceType: 'Curtain Cleaning',
    price: '199',
    unitText: 'panel',
    wikidata: 'https://www.wikidata.org/wiki/Q841364',
  },
  {
    id: `${ORIGIN}/#service-bedsheet-linen`,
    name: 'Bedsheet & Heavy Linen Wash',
    description: 'Hygienic anti-bacterial hot wash and steam finish for king/queen bedsheets, duvet covers, and blankets.',
    serviceType: 'Linen Laundry',
    price: '99',
    unitText: 'piece',
    wikidata: 'https://www.wikidata.org/wiki/Q849495',
  },
];

/**
 * Top-level global entities representing the brand, website, catalog, and local operations.
 */
const globalEntities = () => [
  {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: CANONICAL_BRAND,
    alternateName: ['laundary.online', 'Laundry Online India'],
    url: `${ORIGIN}/`,
    logo: { '@id': `${ORIGIN}/#logo` },
    image: { '@id': `${ORIGIN}/#logo` },
    description:
      'India’s leading doorstep laundry and eco-friendly dry cleaning network providing free pickup and delivery across Mumbai, Pune, Bangalore, Delhi NCR, and 14+ metro cities.',
    telephone: PHONE,
    email: SUPPORT_EMAIL,
    sameAs: [
      WHATSAPP,
      'https://www.wikidata.org/wiki/Q849495',
      'https://www.wikidata.org/wiki/Q841364',
    ],
    contactPoint: { '@id': `${ORIGIN}/#contactpoint` },
    knowsAbout: KNOWS_ABOUT,
  },
  {
    '@type': 'ContactPoint',
    '@id': `${ORIGIN}/#contactpoint`,
    telephone: PHONE,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'mr'],
    url: `${ORIGIN}/contact.html`,
  },
  {
    '@type': 'ImageObject',
    '@id': `${ORIGIN}/#logo`,
    url: IMAGE,
    contentUrl: IMAGE,
    width: 1200,
    height: 630,
    caption: 'laundry.online — Doorstep Laundry & Dry Cleaning',
  },
  {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: CANONICAL_BRAND,
    description: 'On-demand laundry and dry cleaning at your doorstep with free pickup and delivery.',
    inLanguage: 'en-IN',
    publisher: { '@id': `${ORIGIN}/#organization` },
  },
  {
    '@type': ['LocalBusiness', 'DryCleaningOrLaundry'],
    '@id': `${ORIGIN}/#localbusiness`,
    name: CANONICAL_BRAND,
    alternateName: 'laundary.online',
    url: `${ORIGIN}/`,
    image: { '@id': `${ORIGIN}/#logo` },
    logo: { '@id': `${ORIGIN}/#logo` },
    description:
      'Professional doorstep laundry, eco-certified dry cleaning, wash & fold, steam pressing, and 24-hr express laundry with free home pickup and delivery.',
    priceRange: '₹29 - ₹999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    parentOrganization: { '@id': `${ORIGIN}/#organization` },
    telephone: PHONE,
    email: SUPPORT_EMAIL,
    areaServed: CITIES.map((c) => ({
      '@type': 'City',
      name: c.name,
      sameAs: c.sameAs,
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12, Service Road, Andheri East',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400069',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.1136',
      longitude: '72.8697',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '21:00',
    }],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '52480',
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: { '@id': `${ORIGIN}/#catalog` },
    sameAs: [
      WHATSAPP,
      'https://www.wikidata.org/wiki/Q849495',
      'https://www.wikidata.org/wiki/Q841364',
    ],
    knowsAbout: KNOWS_ABOUT,
  },
  {
    '@type': 'OfferCatalog',
    '@id': `${ORIGIN}/#catalog`,
    name: 'laundry.online Complete Garment Care Catalog',
    provider: { '@id': `${ORIGIN}/#localbusiness` },
    itemListElement: SERVICES_CATALOG.map((svc, i) => ({
      '@type': 'Offer',
      position: i + 1,
      price: svc.price,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: svc.price,
        priceCurrency: 'INR',
        unitText: svc.unitText,
      },
      itemOffered: { '@id': svc.id },
    })),
  },
  ...SERVICES_CATALOG.map((svc) => ({
    '@type': 'Service',
    '@id': svc.id,
    name: svc.name,
    description: svc.description,
    serviceType: svc.serviceType,
    provider: { '@id': `${ORIGIN}/#localbusiness` },
    areaServed: CITIES.map((c) => ({
      '@type': 'City',
      name: c.name,
      sameAs: c.sameAs,
    })),
    category: {
      '@type': 'DefinedTerm',
      name: svc.serviceType,
      sameAs: svc.wikidata,
    },
  })),
];

/** Per-page nodes. */
const pages = [
  {
    file: 'index.html',
    path: '/',
    type: 'CollectionPage',
    name: 'laundry.online — Doorstep Laundry & Dry Cleaning | Free Pick & Drop',
    description:
      'Professional doorstep laundry, wash & fold at ₹69/kg, eco dry cleaning from ₹149, and steam pressing with free pickup & delivery across India.',
  },
  {
    file: 'about.html',
    path: '/about.html',
    type: 'AboutPage',
    name: 'About laundry.online — Doorstep Garment Care & Quality Standards',
    description:
      'Learn about laundry.online, our industrial eco-friendly washing facilities, quality control checks, digital weighing scales, and 20+ city footprint.',
  },
  {
    file: 'contact.html',
    path: '/contact.html',
    type: 'ContactPage',
    name: 'Contact laundry.online — Customer Support, Pickups & Franchise',
    description:
      'Reach laundry.online customer care, book an on-demand laundry pickup slot, or explore franchise partnership opportunities.',
  },
];

function crumbs(path) {
  const trail = [{ name: 'Home', url: `${ORIGIN}/` }];
  const file = path.split('/').pop();
  if (file && file !== '') {
    trail.push({
      name: file.replace('.html', '').replace(/^\w/, (c) => c.toUpperCase()),
      url: `${ORIGIN}${path}`,
    });
  }
  return trail;
}

const FAQ_ITEMS = [
  {
    question: 'How does laundry.online doorstep pickup and delivery work?',
    answer: 'Place your order online or via WhatsApp. A verified logistics rider arrives at your doorstep with a digital hanging scale, measures your garments in your presence, and provides an instant digital receipt. Cleaned and pressed clothes are returned within 24 to 72 hours.',
  },
  {
    question: 'What is the standard turnaround time for laundry and dry cleaning?',
    answer: 'Standard wash & fold and wash & steam iron takes 48–72 hours. For emergency or business travel requirements, select Express Laundry at checkout for guaranteed 24-hour delivery.',
  },
  {
    question: 'Is doorstep pickup and delivery free of cost?',
    answer: 'Yes, laundry.online provides 100% free doorstep pickup and delivery on all standard orders across Mumbai, Pune, Bangalore, Delhi NCR, and all served metropolitan areas with zero hidden convenience fees.',
  },
  {
    question: 'What are the charges for online dry cleaning and laundry services in India?',
    answer: 'Wash & Fold starts at ₹69/kg, Wash & Steam Iron at ₹99/kg, and Professional Eco Dry Cleaning starts at ₹149 per garment piece. Steam pressing is available from ₹29/piece.',
  },
  {
    question: 'Can laundry.online dry cleaners remove tough grease, oil, and turmeric stains?',
    answer: 'Yes. Our facilities utilize pre-spotting inspection stations with specialized non-toxic enzyme and solvent stain-release agents designed specifically for stubborn oil, coffee, ink, makeup, and turmeric stains without degrading fabric tensile strength.',
  },
  {
    question: 'How are clothes weighed and billed for per-kg laundry?',
    answer: 'Clothes are weighed directly in front of you at your doorstep using certified electronic hanging scales. The weight is recorded on your digital invoice sent via SMS/WhatsApp before the items leave your premises.',
  },
  {
    question: 'What if a garment gets damaged or lost during processing?',
    answer: 'Every order is covered by our Garment Care & Quality Guarantee. Each item undergoes 3-stage barcode sorting and tracking, and verified damage claims are reimbursed up to 10x the service charge.',
  },
  {
    question: 'Which cities and regions does laundry.online operate in?',
    answer: 'laundry.online operates across major Indian metros including Mumbai, Pune, Bengaluru, Delhi NCR (Noida, Gurgaon), Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, and Thane.',
  },
];

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
        '@id': `${url}#page`,
        url,
        name: page.name,
        description: page.description,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#localbusiness` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-IN',
      }] : []),
      ...(page.file === 'index.html' ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        name: 'Frequently Asked Questions About laundry.online Doorstep Laundry',
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${ORIGIN}/#localbusiness` },
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
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

// 1. Build and export ontology.json semantic triples map
const ontology = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  brand: CANONICAL_BRAND,
  origin: ORIGIN,
  version: '2026-GEO-LLMO-v1',
  description: 'Formal Knowledge Graph & Semantic Entity Ontology for laundry.online',
  triples: [
    { subject: 'laundry.online', predicate: 'providesService', object: 'Doorstep Laundry Service' },
    { subject: 'laundry.online', predicate: 'providesService', object: 'Eco Dry Cleaning' },
    { subject: 'laundry.online', predicate: 'providesService', object: 'Wash & Fold' },
    { subject: 'laundry.online', predicate: 'providesService', object: 'Wash & Steam Iron' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Mumbai (wd:Q1156)' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Pune (wd:Q1538)' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Bengaluru (wd:Q1355)' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Delhi NCR (wd:Q1353)' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Hyderabad (wd:Q1361)' },
    { subject: 'laundry.online', predicate: 'operatesInCity', object: 'Chennai (wd:Q1352)' },
    { subject: 'laundry.online', predicate: 'standardTurnaround', object: '24-48 Hours' },
    { subject: 'laundry.online', predicate: 'basePriceWashFold', object: '₹69 per kg' },
    { subject: 'laundry.online', predicate: 'basePriceWashIron', object: '₹99 per kg' },
    { subject: 'laundry.online', predicate: 'basePriceDryClean', object: '₹149 per piece' },
    { subject: 'laundry.online', predicate: 'contactPhone', object: PHONE },
    { subject: 'laundry.online', predicate: 'contactWhatsApp', object: WHATSAPP },
  ],
  entities: globalEntities(),
};

writeFileSync(resolve(process.cwd(), 'ontology.json'), JSON.stringify(ontology, null, 2), 'utf8');
console.log('✓ Created ontology.json Knowledge Graph semantic triples');

// 2. Inject schema into HTML pages
const BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g;

for (const page of pages) {
  const file = resolve(process.cwd(), page.file);
  let html = readFileSync(file, 'utf8');

  // Strip existing JSON-LD
  html = html.replace(BLOCK, '');
  const block = `<script type="application/ld+json">\n${JSON.stringify(graphFor(page), null, 2)}\n</script>\n`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${block}</head>`);
  } else {
    html = block + html;
  }

  writeFileSync(file, html, 'utf8');
  console.log(`✓ Injected schema @graph into ${page.file}`);
}

console.log('Schema & Knowledge Graph injection complete.');
