#!/usr/bin/env node
/**
 * Assemble the exact set of files Cloudflare Pages publishes.
 *
 * This project is a manual-upload Pages project whose `pages_build_output_dir`
 * is the repository root, so `wrangler pages deploy .` publishes every file in
 * the working tree. That included `.env` (live GoDaddy + Cloudflare
 * credentials), which was reachable at https://laundary.online/.env.
 *
 * An allowlist is used rather than a denylist so that a newly added secret,
 * config file or editor artefact is never published by accident: anything not
 * named in PUBLISH is left behind.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const OUT = resolve(ROOT, 'dist/site');

/** Directories published verbatim, including Pages Functions. */
const PUBLISH_DIRS = ['assets', 'css', 'js', 'functions'];

/** Individual files published verbatim. */
const PUBLISH_FILES = [
  'index.html',
  'about.html',
  'contact.html',
  'robots.txt',
  'sitemap.xml',
  // Cloudflare domain-verification file; must stay reachable at the root.
  '41e6f13d-316e-406c-9820-6b0c949e6374.txt',
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const copied = [];

for (const dir of PUBLISH_DIRS) {
  const from = join(ROOT, dir);
  if (!existsSync(from)) continue;
  cpSync(from, join(OUT, dir), { recursive: true });
  copied.push(`${dir}/ (${countFiles(join(ROOT, dir))} files)`);
}

for (const file of PUBLISH_FILES) {
  const from = join(ROOT, file);
  if (!existsSync(from)) {
    console.warn(`  skip (missing): ${file}`);
    continue;
  }
  cpSync(from, join(OUT, file));
  copied.push(file);
}

console.log(`staged -> ${OUT}`);
for (const c of copied) console.log(`  + ${c}`);

// Guard against a regression: the staged tree must never contain a dotfile, a
// .md file, or anything else that was not explicitly allowlisted above.
const strays = [];
(function walk(dir, prefix = '') {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(abs).isDirectory()) walk(abs, rel);
    else if (entry.startsWith('.') || /\.(md|py|txt\.orig)$/i.test(entry) || entry === '.env') {
      strays.push(rel);
    }
  }
})(OUT);

if (strays.length) {
  console.error(`\nREFUSING TO DEPLOY - staged tree contains non-public files:\n  ${strays.join('\n  ')}`);
  process.exit(1);
}

console.log('\nverify: no dotfiles or .md files in staged output');

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    n += statSync(abs).isDirectory() ? countFiles(abs) : 1;
  }
  return n;
}
