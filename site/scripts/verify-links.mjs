// Crawls dist/ and verifies every internal href/src resolves to a built file.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const htmlFiles = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const attrRe = /\b(?:href|src|srcset|content|data-full)=["']([^"']+)["']/g;
let errors = 0, checked = 0;
const seen = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(attrRe)) {
    const raw = m[1];
    const candidates = raw.includes(',') && /\s\d+w/.test(raw) ? raw.split(',').map((s) => s.trim().split(/\s+/)[0]) : [raw];
    for (let url of candidates) {
      if (!url || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#') || url.startsWith('data:') || url.startsWith('javascript:')) continue;
      url = url.split('#')[0].split('?')[0];
      if (!url.startsWith('/')) continue;
      if (base && url.startsWith(base)) url = url.slice(base.length) || '/';
      if (seen.has(url)) continue;
      seen.add(url);
      checked++;
      const target = url.endsWith('/') ? join(dist, url, 'index.html') : join(dist, url);
      const ok = existsSync(target) || existsSync(target + '.html') || existsSync(join(dist, url, 'index.html'));
      if (!ok) { errors++; console.error(`MISSING ${url}  (in ${file.replace(dist, '')})`); }
    }
  }
}
console.log(`${htmlFiles.length} pages, ${checked} unique internal URLs checked, ${errors} missing`);
process.exit(errors ? 1 : 0);
