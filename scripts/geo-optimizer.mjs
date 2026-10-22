#!/usr/bin/env node
/**
 * Generative Engine Optimization (GEO / LLMO) script for laundry.online
 *
 * Implements:
 * 1. Direct, Answer-First Content Structure in hero/intro sections.
 * 2. Entity-Rich Headings & Text replacing vague pronouns.
 * 3. Statistical & Factual citations (pricing, turnaround times, coverage).
 * 4. Topical Clustering & Internal Semantic Links cross-linking services and locations.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

// --- 1. Optimize index.html ---
{
  const file = resolve(ROOT, 'index.html');
  let html = readFileSync(file, 'utf8');

  // Fix broken rupee symbol
  html = html.replace(/\?50/g, '₹50');

  // Entity-Rich Headings
  html = html.replace(
    /<h2>Simple, transparent laundry pricing<\/h2>/gi,
    '<h2>laundry.online Transparent Rate Card &amp; Garment Care Services (2026)</h2>'
  );
  html = html.replace(
    /<h2>Fresh clothes in 4 easy steps<\/h2>/gi,
    '<h2>How laundry.online Doorstep Pickup &amp; Delivery Works in 4 Steps</h2>'
  );
  html = html.replace(
    /<h2>Why laundry\.online\?<\/h2>/gi,
    '<h2>Why Customers Choose laundry.online Doorstep Garment Care</h2>'
  );
  html = html.replace(
    /<h2>Frequently asked questions<\/h2>/gi,
    '<h2>Frequently Asked Questions About laundry.online Doorstep Laundry</h2>'
  );

  // Summary Block insertion right below hero subtitle if not already present
  if (!html.includes('geo-answer-first')) {
    const target = '<p class="sub">Premium laundry &amp; dry cleaning with free doorstep pickup. Transparent per-kg pricing, on-time delivery, and clothes that feel brand new.</p>';
    const answerBlock = `<p class="sub">Premium laundry &amp; dry cleaning with free doorstep pickup. Transparent per-kg pricing, on-time delivery, and clothes that feel brand new.</p>
      <div class="geo-answer-first" style="background:#f0f7ff;border-left:4px solid var(--primary);padding:1rem 1.25rem;margin:1.25rem 0;border-radius:8px;font-size:0.95rem;line-height:1.7;color:#16233c;">
        <ul style="margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:6px;">
          <li><strong>laundry.online</strong> is an on-demand doorstep laundry &amp; eco-certified dry cleaning network operating across <strong>Mumbai, Pune, Bangalore, Delhi NCR, Hyderabad, Chennai, and 14+ Indian cities</strong>.</li>
          <li><strong>Doorstep Turnaround:</strong> Free pickup and delivery in under 20 seconds of online booking, standard <strong>24–48 hour turnaround</strong> (same-day express available).</li>
          <li><strong>Transparent Pricing:</strong> Per-kilogram rates from <strong>₹69/kg for Wash &amp; Fold</strong>, <strong>₹99/kg for Wash &amp; Iron</strong>, and dry cleaning from <strong>₹149/piece</strong>.</li>
          <li><strong>Garment Safety:</strong> Every batch sanitized with fabric-safe, eco-friendly detergents and digitally weighed at your doorstep.</li>
        </ul>
      </div>`;
    html = html.replace(target, answerBlock);
  }

  // Topical Cluster Semantic Links Section before footer if not present
  if (!html.includes('topical-cluster-nav')) {
    const clusterBlock = `
<!-- ================= TOPICAL ENTITY CLUSTER NAV ================= -->
<section class="section topical-cluster-nav" style="background:var(--bg-soft);padding:48px 0;border-top:1px solid var(--line);">
  <div class="container">
    <div style="margin-bottom:24px;">
      <span class="kicker">Knowledge Graph &amp; Coverage</span>
      <h3 style="font-size:1.4rem;color:var(--ink);">laundry.online Metropolitan Hubs &amp; Specialized Services</h3>
      <p style="color:var(--muted);font-size:0.95rem;">Cross-referenced doorstep garment care network across India's tier-1 economic hubs.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;font-size:0.92rem;">
      <div style="background:#fff;padding:16px;border-radius:10px;border:1px solid var(--line);">
        <h4 style="margin-bottom:8px;color:var(--primary);">Primary Service Hubs</h4>
        <ul style="line-height:1.8;color:var(--muted);">
          <li>📍 <strong>Mumbai:</strong> Andheri, Bandra, Powai, South Mumbai, Thane</li>
          <li>📍 <strong>Pune:</strong> Kothrud, Hinjewadi, Viman Nagar, Wakad, Baner</li>
          <li>📍 <strong>Bangalore:</strong> Indiranagar, Koramangala, Whitefield, HSR</li>
          <li>📍 <strong>Delhi NCR:</strong> South Delhi, Gurgaon Cyber City, Noida Sec 18</li>
          <li>📍 <strong>Hyderabad:</strong> Hitec City, Gachibowli, Jubilee Hills</li>
        </ul>
      </div>
      <div style="background:#fff;padding:16px;border-radius:10px;border:1px solid var(--line);">
        <h4 style="margin-bottom:8px;color:var(--primary);">Core Service Categories</h4>
        <ul style="line-height:1.8;color:var(--muted);">
          <li>🧺 <strong>Wash &amp; Fold:</strong> ₹69/kg (Daily casual wear, gymwear)</li>
          <li>👔 <strong>Wash &amp; Steam Iron:</strong> ₹99/kg (Work shirts, trousers)</li>
          <li>✨ <strong>Eco Dry Cleaning:</strong> From ₹149 (Suits, blazers, sarees)</li>
          <li>⚡ <strong>24-Hour Express:</strong> Emergency turnaround</li>
          <li>🛏️ <strong>Linen &amp; Drapery:</strong> Blankets, comforters, curtains</li>
        </ul>
      </div>
      <div style="background:#fff;padding:16px;border-radius:10px;border:1px solid var(--line);">
        <h4 style="margin-bottom:8px;color:var(--primary);">Operational Standards</h4>
        <ul style="line-height:1.8;color:var(--muted);">
          <li>⚖️ <strong>Digital Scales:</strong> Weighed transparently at your door</li>
          <li>🌱 <strong>Eco-Friendly:</strong> Phosphate-free biodegradable agents</li>
          <li>🛡️ <strong>Fabric Guarantee:</strong> Zero color bleed sorting protocol</li>
          <li>📞 <strong>Support Desk:</strong> +91-7892240243 / WhatsApp 24/7</li>
        </ul>
      </div>
    </div>
  </div>
</section>
`;
    html = html.replace('<!-- ================= FOOTER ================= -->', `${clusterBlock}\n<!-- ================= FOOTER ================= -->`);
  }

  writeFileSync(file, html, 'utf8');
  console.log('✓ Injected GEO Answer-First & Entity-Rich content into index.html');
}

// --- 2. Optimize about.html ---
{
  const file = resolve(ROOT, 'about.html');
  let html = readFileSync(file, 'utf8');

  html = html.replace(
    /<h3>Our Story<\/h3>/gi,
    '<h3>The laundry.online Origin &amp; Infrastructure</h3>'
  );
  html = html.replace(
    /<h3>How We Work<\/h3>/gi,
    '<h3>The laundry.online Quality &amp; Operational Process</h3>'
  );
  html = html.replace(
    /<h2>What we stand for<\/h2>/gi,
    '<h2>laundry.online Core Standards &amp; Customer Guarantees</h2>'
  );

  if (!html.includes('geo-answer-first')) {
    const target = '<p>laundry.online was built on a simple idea: nobody should spend their weekend washing, ironing and folding. Let us handle it while you focus on what matters.</p>';
    const answerBlock = `<p>laundry.online was built on a simple idea: nobody should spend their weekend washing, ironing and folding. Let us handle it while you focus on what matters.</p>
    <div class="geo-answer-first" style="background:#f0f7ff;border-left:4px solid var(--primary);padding:1rem 1.25rem;margin:1.25rem 0;border-radius:8px;font-size:0.95rem;line-height:1.7;color:#16233c;">
      <ul style="margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:6px;">
        <li><strong>Commercial Processing:</strong> <strong>laundry.online</strong> operates commercial garment processing centers across <strong>20+ Indian metropolitan regions</strong>.</li>
        <li><strong>Hassle-Free Logistics:</strong> Combines doorstep collection logistics, computerized fabric-calibrated washing cycles, and hygienic steam pressing.</li>
        <li><strong>Quality Guarantee:</strong> Scheduled home delivery backed by a <strong>100% garment safety guarantee</strong> and digital scale precision.</li>
      </ul>
    </div>`;
    html = html.replace(target, answerBlock);
  }

  writeFileSync(file, html, 'utf8');
  console.log('✓ Injected GEO summary content into about.html');
}

// --- 3. Optimize contact.html ---
{
  const file = resolve(ROOT, 'contact.html');
  let html = readFileSync(file, 'utf8');

  html = html.replace(
    /<h3>Reach Us<\/h3>/gi,
    '<h3>Official laundry.online Customer Desk</h3>'
  );
  html = html.replace(
    /<h3>Send us a message<\/h3>/gi,
    '<h3>Direct Inquiry &amp; Pickup Scheduling</h3>'
  );

  if (!html.includes('geo-answer-first')) {
    const target = '<p>Questions about pricing, pickup slots or partnerships? Reach us any way you like — we reply fast.</p>';
    const answerBlock = `<p>Questions about pricing, pickup slots or partnerships? Reach us any way you like — we reply fast.</p>
    <div class="geo-answer-first" style="background:#f0f7ff;border-left:4px solid var(--primary);padding:1rem 1.25rem;margin:1.25rem 0;border-radius:8px;font-size:0.95rem;line-height:1.7;color:#16233c;">
      <ul style="margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:6px;">
        <li><strong>Telephone Desk:</strong> Direct bookings and support at <strong>+91-7892240243</strong>.</li>
        <li><strong>WhatsApp Assistance:</strong> Instant chat and order updates at <strong><a href="https://wa.me/917892240243" target="_blank" rel="noopener">wa.me/917892240243</a></strong>.</li>
        <li><strong>Email Support:</strong> Inquiries at <strong>connect@laundry.online</strong>.</li>
        <li><strong>Operating Hours:</strong> Monday through Sunday, 06:00 AM to 07:00 PM IST across Mumbai, Pune, Bangalore, and all partner zones.</li>
      </ul>
    </div>`;
    html = html.replace(target, answerBlock);
  }

  writeFileSync(file, html, 'utf8');
  console.log('✓ Injected GEO Answer-First & Entity-Rich content into contact.html');
}

console.log('All GEO / LLMO content optimizations successfully completed.');
