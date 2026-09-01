import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'uploads', 'properties');
mkdirSync(outDir, { recursive: true });

// Soft, premium gradients tuned to the brand palette.
const palettes = [
  ['#0c201a', '#1a3a2f', '#2b6b53'],
  ['#182c3a', '#2b5a6b', '#4d8a9b'],
  ['#33302e', '#5c4d3f', '#a0763a'],
  ['#2b2a33', '#4a4468', '#8a7bb0'],
  ['#0f2b24', '#235044', '#58a68a'],
  ['#2c2030', '#5a3750', '#a85a80'],
];

const labels = [
  'Kilimani Apartment',
  'Karen House',
  'Westlands Townhouse',
  'Runda Villa',
  'Lavington Residence',
  'Kileleshwa Apartment',
];

function svg(i) {
  const [a, b, c] = palettes[i % palettes.length];
  const label = labels[i % labels.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="0.5" stop-color="${b}"/>
      <stop offset="1" stop-color="${c}"/>
    </linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a}" stop-opacity="0"/>
      <stop offset="1" stop-color="${c}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect width="1200" height="900" fill="url(#sky)"/>
  <circle cx="900" cy="200" r="80" fill="#ffffff" opacity="0.12"/>
  ${building(520)}
  <text x="60" y="820" font-family="Georgia, serif" font-size="44" fill="#ffffff" opacity="0.92">${label}</text>
  <text x="60" y="868" font-family="Georgia, serif" font-size="24" fill="#ffffff" opacity="0.6">Wellton Real Estate</text>
</svg>`;
}

function building(x) {
  let rects = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      rects += `<rect x="${x + 90 + c * 70}" y="${230 + r * 110}" width="42" height="60" rx="4" fill="#ffffff" opacity="0.22"/>`;
    }
  }
  return `<rect x="${x}" y="180" width="420" height="480" rx="10" fill="#ffffff" opacity="0.14"/>
    <rect x="${x}" y="180" width="420" height="80" rx="10" fill="#ffffff" opacity="0.2"/>
    ${rects}`;
}

for (let i = 0; i < 12; i++) {
  writeFileSync(path.join(outDir, `placeholder-${i + 1}.svg`), svg(i));
}
console.log('placeholders generated');
