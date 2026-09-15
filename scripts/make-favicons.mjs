#!/usr/bin/env node
/**
 * npm run favicons
 *
 * Generates the fallback icons from public/favicon.svg (the source of truth):
 *   public/favicon.ico          — 16/32/48px, for browsers without SVG icons
 *   public/apple-touch-icon.png — 180px, used when saved to an iPhone home screen
 *
 * Rerun after editing favicon.svg, then commit the outputs.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SVG = readFileSync('public/favicon.svg');
const BOARD = '#0e3b2e';

/** Rasterise the SVG at `size` px; `flatten` fills transparent corners. */
async function png(size, flatten = false) {
  let img = sharp(SVG, { density: Math.ceil((72 * size) / 32) * 2 }).resize(size, size);
  if (flatten) img = img.flatten({ background: BOARD });
  return img.png().toBuffer();
}

/**
 * ICO container holding PNG images (supported by every current browser and
 * Windows). Layout: 6-byte header, one 16-byte directory entry per image,
 * then the PNG payloads.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
writeFileSync('public/favicon.ico', ico(images));

// iOS masks its own rounded corners and shows transparency as black, so the
// touch icon is flattened onto the board colour.
writeFileSync('public/apple-touch-icon.png', await png(180, true));

console.log(`favicon.ico (${sizes.join('/')}px) and apple-touch-icon.png (180px) written.`);
