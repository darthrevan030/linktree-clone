import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { computeSquareCrop } from '../scripts/crop.mjs';

const SCRIPT = resolve('scripts/crop-avatar.mjs');

describe('computeSquareCrop', () => {
  it('centres a square of the requested size on the given point', () => {
    // 2400x2000 image, shorter side 2000, size 0.5 -> 1000px square centred at (1200, 1000).
    expect(computeSquareCrop(2400, 2000, { centerX: 0.5, centerY: 0.5, size: 0.5 })).toEqual({
      left: 700,
      top: 500,
      width: 1000,
      height: 1000,
    });
  });

  it('shifts the square back inside the image instead of shrinking it', () => {
    // Centre at the top-left corner would push the square off-canvas.
    expect(computeSquareCrop(1000, 800, { centerX: 0, centerY: 0, size: 0.5 })).toEqual({
      left: 0,
      top: 0,
      width: 400,
      height: 400,
    });
    // ...and the bottom-right corner.
    expect(computeSquareCrop(1000, 800, { centerX: 1, centerY: 1, size: 0.5 })).toEqual({
      left: 600,
      top: 400,
      width: 400,
      height: 400,
    });
  });

  it.each([
    ['size 0', { centerX: 0.5, centerY: 0.5, size: 0 }],
    ['size above 1', { centerX: 0.5, centerY: 0.5, size: 1.2 }],
    ['centre out of range', { centerX: 1.5, centerY: 0.5, size: 0.5 }],
  ])('rejects %s', (_name, crop) => {
    expect(() => computeSquareCrop(1000, 1000, crop)).toThrow(RangeError);
  });

  it('rejects non-positive image dimensions', () => {
    expect(() => computeSquareCrop(0, 100, { centerX: 0.5, centerY: 0.5, size: 0.5 })).toThrow(
      RangeError,
    );
  });
});

describe('crop-avatar script (fresh checkout)', () => {
  let dir: string;

  beforeEach(() => {
    // Mirrors a fresh git clone / Vercel build: src/assets/ does NOT exist,
    // because git does not track directories whose only file is gitignored.
    dir = mkdtempSync(join(tmpdir(), 'crop-avatar-'));
    mkdirSync(join(dir, 'public'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function run() {
    return spawnSync(process.execPath, [SCRIPT], { cwd: dir, encoding: 'utf8' });
  }

  it('creates src/assets/ and writes the avatar when the directory is missing', async () => {
    await sharp({
      create: { width: 1200, height: 1000, channels: 3, background: '#336699' },
    })
      .jpeg()
      .toFile(join(dir, 'public', 'samarth-bhatia.jpg'));

    expect(existsSync(join(dir, 'src', 'assets'))).toBe(false);

    const result = run();

    expect(result.status, result.stderr).toBe(0);
    const out = join(dir, 'src', 'assets', 'avatar.generated.jpg');
    expect(existsSync(out)).toBe(true);
    const meta = await sharp(out).metadata();
    expect(meta.width).toBe(672);
    expect(meta.height).toBe(672);
  });

  it('exits cleanly and writes nothing when the source photo is absent', () => {
    const result = run();

    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(join(dir, 'src', 'assets', 'avatar.generated.jpg'))).toBe(false);
  });
});
