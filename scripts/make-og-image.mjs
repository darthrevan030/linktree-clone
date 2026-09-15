#!/usr/bin/env node
/**
 * npm run og-image
 *
 * Generates public/og.png (1200x630, the standard og:image / twitter:card
 * size) as a branded card echoing the hub's circuit-board look: board green,
 * copper corner pads, gold accent text.
 *
 * Uses generic system font stacks rather than the site's @fontsource files —
 * SVG rasterisation here goes through libvips' bundled renderer, which
 * resolves fonts via the OS, not the project's npm-installed font files.
 * That's an acceptable tradeoff for a static social-preview image (legibility
 * matters more than brand-perfect type here).
 *
 * Rerun after changing profile.ts/tagline copy, then commit the output.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { profile } from '../src/data/profile.ts';

const INK = '#0a3026';
const SURFACE = '#0e3b2e';
const LINE = '#2f6352';
const MUTED = '#a9bdb2';
const TEXT = '#eef0e8';
const ACCENT = '#d9b36a';
const COPPER = '#c8894a';

const W = 1200;
const H = 630;
const MARGIN = 40;
const boardX = MARGIN;
const boardY = MARGIN;
const boardW = W - MARGIN * 2;
const boardH = H - MARGIN * 2;

/** XML-escape the handful of profile strings that land in the SVG as text. */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const corners = [
  [boardX + 24, boardY + 24],
  [boardX + boardW - 24, boardY + 24],
  [boardX + 24, boardY + boardH - 24],
  [boardX + boardW - 24, boardY + boardH - 24],
];

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect x="${boardX}" y="${boardY}" width="${boardW}" height="${boardH}" rx="28" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
  ${corners
    .map(
      ([cx, cy]) =>
        `<circle cx="${cx}" cy="${cy}" r="9" fill="${COPPER}" stroke="${INK}" stroke-width="3"/>`,
    )
    .join('\n  ')}

  <text x="96" y="150" font-family="Consolas, 'Courier New', monospace" font-size="22"
        letter-spacing="6" fill="${COPPER}">U1 &#183; SAMARTH BHATIA</text>

  <text x="94" y="270" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="88"
        letter-spacing="2" fill="${TEXT}">${esc(profile.firstName.toUpperCase())}</text>
  <text x="94" y="360" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="88"
        letter-spacing="2" fill="${TEXT}">${esc(profile.lastName.toUpperCase())}</text>

  <text x="96" y="430" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${MUTED}">${esc(profile.tagline)}</text>

  <text x="96" y="480" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${MUTED}">${esc(profile.current.role)} at <tspan fill="${ACCENT}" font-weight="700">${esc(profile.current.org)}</tspan></text>

  <text x="96" y="${boardY + boardH - 44}" font-family="Consolas, 'Courier New', monospace" font-size="24"
        letter-spacing="4" fill="${ACCENT}">${esc(profile.siteUrl.replace('https://', ''))}</text>
</svg>
`;

writeFileSync('public/og.png', await sharp(Buffer.from(svg)).png().toBuffer());
console.log(`public/og.png written (${W}x${H}).`);
