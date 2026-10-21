// Genera src/styles/paletas.css a partir de src/data/paletas.json
import { readFileSync, writeFileSync } from 'node:fs';
const paletas = JSON.parse(readFileSync(new URL('../src/data/paletas.json', import.meta.url), 'utf8'));
let css = '/* Generado por scripts/build-paletas.mjs. Edita src/data/paletas.json y ejecuta `npm run paletas`. */\n';
for (const p of paletas) {
  if (p.id === 'taller') continue; // la paleta base vive en global.css
  const vars = Object.entries(p.t).map(([k, v]) => `  --${k}: ${v};`).join('\n');
  css += `:root[data-paleta="${p.id}"] {\n${vars}\n}\n`;
}
writeFileSync(new URL('../src/styles/paletas.css', import.meta.url), css);
console.log(`paletas.css: ${paletas.length - 1} paletas`);
