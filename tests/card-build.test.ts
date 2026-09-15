/**
 * End-to-end privacy guarantees for the private NFC card page.
 *
 * Builds the site WITH a fake CARD_KEY and CONTACT_PHONE into a temp directory,
 * then inspects every emitted file. Unit tests can each pass while the built
 * output still leaks — this checks what actually ships.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import ICAL from 'ical.js';

const KEY = 'TestCardKey0123456789';
const PHONE = '+65 9123 4567';
const PHONE_DIGITS = '91234567';

let out: string;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Text-like build outputs where a leaked value could appear. */
function textFiles(): { path: string; body: string }[] {
  return walk(out)
    .filter((f) => /\.(html|vcf|js|css|json|xml|txt|webmanifest)$/.test(f))
    .map((f) => ({ path: relative(out, f), body: readFileSync(f, 'utf8') }));
}

const cardDir = () => join('c', KEY);
const insideCard = (p: string) => p.startsWith(cardDir() + sep) || p.startsWith(`c/${KEY}/`);

beforeAll(() => {
  // Must be on the same drive as the project: Astro MOVES assets from .astro/
  // into the output with fs.rename, which fails across drives (EXDEV) — e.g. a
  // project on D: with the OS temp dir on C:. node_modules/.cache is gitignored.
  const cache = resolve('node_modules/.cache');
  mkdirSync(cache, { recursive: true });
  out = mkdtempSync(join(cache, 'card-build-'));
  const result = spawnSync(
    process.execPath,
    [resolve('node_modules/astro/bin/astro.mjs'), 'build', '--outDir', out],
    {
      encoding: 'utf8',
      env: { ...process.env, CARD_KEY: KEY, CONTACT_PHONE: PHONE },
    },
  );
  if (result.status !== 0) {
    throw new Error(`card build failed (exit ${result.status}):\n${result.stderr || result.stdout}`);
  }
}, 180_000);

afterAll(() => {
  if (out) rmSync(out, { recursive: true, force: true });
});

describe('private card build', () => {
  it('generates the card page and its contact file at the key path', () => {
    expect(existsSync(join(out, 'c', KEY, 'index.html'))).toBe(true);
    expect(existsSync(join(out, 'c', KEY, 'samarth-bhatia.vcf'))).toBe(true);
  });

  it('keeps the card page out of search engines and never leaks its URL via Referer', () => {
    const html = readFileSync(join(out, 'c', KEY, 'index.html'), 'utf8');
    expect(html).toMatch(/<meta name="robots" content="noindex, nofollow, noarchive">/);
    expect(html).toMatch(/<meta name="referrer" content="no-referrer">/);
    // Canonical points at the public hub, so no crawler-followable tag holds the key.
    expect(html).toContain('<link rel="canonical" href="https://samarthbhatia.com/">');
  });

  it('serves the phone in the card contact file', () => {
    const vcf = readFileSync(join(out, 'c', KEY, 'samarth-bhatia.vcf'), 'utf8');
    const card = new ICAL.Component(ICAL.parse(vcf));
    expect(card.getFirstPropertyValue('tel')).toBe(PHONE);
    expect(card.getFirstPropertyValue('fn')).toBe('Samarth Bhatia');
  });

  it('keeps the phone OUT of the public contact file', () => {
    const vcf = readFileSync(join(out, 'samarth-bhatia.vcf'), 'utf8');
    const card = new ICAL.Component(ICAL.parse(vcf));
    expect(card.getFirstProperty('tel')).toBeNull();
    expect(vcf.replace(/\s/g, '')).not.toContain(PHONE_DIGITS);
  });

  it('never emits the phone number outside the card directory', () => {
    const files = textFiles();
    // Toothless-fixture guard: the phone must be found SOMEWHERE, or this test
    // would pass vacuously on a build that forgot the card entirely.
    const withPhone = files.filter((f) => f.body.replace(/[\s-]/g, '').includes(PHONE_DIGITS));
    expect(withPhone.length).toBeGreaterThan(0);
    expect(withPhone.map((f) => f.path).filter((p) => !insideCard(p))).toEqual([]);
  });

  it('never emits the card key outside the card directory', () => {
    const leaks = textFiles()
      .filter((f) => f.body.includes(KEY))
      .map((f) => f.path)
      .filter((p) => !insideCard(p));
    expect(leaks).toEqual([]);
  });

  it('never puts the phone number into an analytics attribute', () => {
    const html = readFileSync(join(out, 'c', KEY, 'index.html'), 'utf8');
    const trackingValues = [...html.matchAll(/data-ph-[a-z]+="([^"]*)"/g)].map((m) => m[1]);
    expect(trackingValues.length).toBeGreaterThan(0);
    for (const value of trackingValues) {
      expect(value.replace(/[\s-]/g, '')).not.toContain(PHONE_DIGITS);
    }
  });
});
