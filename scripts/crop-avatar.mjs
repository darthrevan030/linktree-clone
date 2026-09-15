#!/usr/bin/env node
/**
 * Runs before `build` and `dev` (npm pre-scripts).
 *
 * Crops the full-size photo in public/ to a tight headshot and writes it to
 * src/assets/avatar.generated.jpg (gitignored). The hub page imports that file
 * so Astro can emit small WebP copies. The original is never modified.
 *
 * If the source photo is absent this exits cleanly and the hub falls back to
 * an initials monogram.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';
import { computeSquareCrop } from './crop.mjs';

const SOURCE = 'public/samarth-bhatia.jpg';
const OUTPUT = 'src/assets/avatar.generated.jpg';

/**
 * Face-centred headshot framing for the current photo. If you replace the
 * photo, adjust these: centre on the face, and pick `size` so the face fills
 * roughly half the crop.
 */
const CROP = { centerX: 0.52, centerY: 0.39, size: 0.55 };

/** 112px avatar at up to 3x density = 336px; 672 leaves headroom. */
const OUTPUT_SIDE = 672;

if (!existsSync(SOURCE)) {
  console.log(`[avatar] ${SOURCE} not found — skipping (hub shows initials).`);
  process.exit(0);
}

// .rotate() with no args applies EXIF orientation, so a phone photo stored
// sideways is cropped in the orientation you actually see.
const { data, info } = await sharp(SOURCE).rotate().toBuffer({ resolveWithObject: true });
const region = computeSquareCrop(info.width, info.height, CROP);

// src/assets/ holds only this gitignored file, so git never tracks the folder
// and it does not exist in a fresh clone (e.g. on Vercel). Create it.
mkdirSync(dirname(OUTPUT), { recursive: true });

await sharp(data)
  .extract(region)
  .resize(OUTPUT_SIDE, OUTPUT_SIDE)
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`[avatar] ${info.width}x${info.height} -> crop ${JSON.stringify(region)} -> ${OUTPUT}`);
