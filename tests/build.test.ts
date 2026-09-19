/**
 * Assertions against the BUILT site in dist/.
 *
 * These catch a class of bug unit tests cannot: a green suite over pages that
 * render nothing, data re-duplicated across pages, or a privacy guarantee
 * silently broken by a refactor.
 *
 * Requires a fresh build — `npm test` runs `astro build` first. If dist/ is
 * missing these FAIL rather than skip: a skipped privacy test is a
 * pass-by-default, which is worse than no test.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIST = join(process.cwd(), 'dist');

function page(route: string): string {
  const file = join(DIST, route, 'index.html');
  if (!existsSync(file)) {
    throw new Error(`Missing ${file}. Run \`npm run build\` (or \`npm test\`) first.`);
  }
  return readFileSync(file, 'utf8');
}

let hub: string;
let projects: string;
let resume: string;

beforeAll(() => {
  hub = page('');
  projects = page('projects');
  resume = page('resume');
});

describe('build smoke test', () => {
  it('renders the hub with a known link and its tracking label', () => {
    expect(hub).toContain('href="https://github.com/darthrevan030"');
    expect(hub).toContain('data-ph-label="github"');
    expect(hub).toContain('Samarth Bhatia');
  });

  it('marks social profile links as rel="me" so crawlers can verify identity', () => {
    for (const doc of [hub, projects, resume]) {
      const githubLink = doc.match(/<a[^>]*href="https:\/\/github\.com\/darthrevan030"[^>]*>/)?.[0];
      expect(githubLink).toBeDefined();
      expect(githubLink).toMatch(/rel="[^"]*\bme\b[^"]*"/);
    }
  });

  it('shows the photography profile as hub pin 2 and still as a test point', () => {
    const url = 'https://www.instagram.com/samarthjpg/';

    // Pin 2 of chip U1. Each segment is cut at its own </li> so a match in the
    // test point row, the footer or the JSON-LD block cannot satisfy this.
    const pinSegments = hub
      .split('<li class="pin')
      .slice(1)
      .map((seg) => seg.slice(0, seg.indexOf('</li>')));
    const pinned = pinSegments.filter((seg) => seg.includes(`href="${url}"`));
    expect(pinned).toHaveLength(1);
    expect(pinned[0]).toMatch(/--pin: 2;/);
    expect(pinned[0]).toContain('data-ph-kind="hub"');
    expect(pinned[0]).toContain('data-ph-label="photography-instagram"');

    // Still a test point, so the rel="me" chain survives on the hub.
    const tpStart = hub.indexOf('id="tp-heading"');
    const tps = hub.slice(tpStart, hub.indexOf('</section>', tpStart));
    const tpLink = tps.match(new RegExp(`<a[^>]*href="${url}"[^>]*>`))?.[0];
    expect(tpLink).toBeDefined();
    expect(tpLink).toMatch(/rel="[^"]*\bme\b[^"]*"/);
    expect(tpLink).toContain('data-ph-kind="social"');
  });

  it('keeps every social in the footer of the non-bare pages', () => {
    for (const doc of [projects, resume]) {
      // Project cards have footers of their own; the site footer is the last.
      const footer = doc.slice(doc.lastIndexOf('<footer'));
      for (const label of ['GitHub', 'LinkedIn', 'Photography', 'Instagram']) {
        expect(footer).toContain(`>${label}</a>`);
      }
    }
  });

  it('embeds a JSON-LD Person schema on the hub, sourced from real profile data', () => {
    const block = hub.match(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )?.[1];
    expect(block).toBeDefined();
    const schema = JSON.parse(block!);
    expect(schema['@type']).toBe('ProfilePage');
    expect(schema.mainEntity.name).toBe('Samarth Bhatia');
    expect(schema.mainEntity.jobTitle).toBe('Product Lead');
    expect(schema.mainEntity.sameAs).toContain('https://github.com/darthrevan030');
    expect(schema.mainEntity.alumniOf.name).toContain('Nanyang Technological University');
  });

  it('builds a detail page for every one of the nine showcased projects', () => {
    for (const slug of [
      'vantage',
      'cloud-janitor',
      'not-just-black',
      'trippy-find',
      'spotify-history-explorer',
      'tinylink',
      'ipms',
      'home-lab',
      'graduate-employment-survey',
    ]) {
      expect(existsSync(join(DIST, 'projects', slug, 'index.html'))).toBe(true);
    }
  });
});

describe('shared project record', () => {
  // One URL, defined once in src/content/projects/vantage.md. If it appears on
  // both pages, both are reading the same record rather than duplicated data.
  const VANTAGE_LIVE = 'https://vantage.samarthbhatia.dev/';

  it('renders the same project link on /projects and /resume', () => {
    expect(projects).toContain(`href="${VANTAGE_LIVE}"`);
    expect(resume).toContain(`href="${VANTAGE_LIVE}"`);
  });

  it('renders every project on the resume, not just showcase ones', () => {
    for (const name of ['Vantage', 'Cloud Janitor', 'Home Lab', 'TinyLink', 'IPMS']) {
      expect(resume).toContain(name);
    }
  });
});

describe('SEO/discovery assets', () => {
  it('generates a sitemap listing public pages but excluding the private NFC card route', () => {
    const index = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
    expect(index).toContain('https://samarthbhatia.com/sitemap-0.xml');

    const urls = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    expect(urls).toContain('<loc>https://samarthbhatia.com/</loc>');
    expect(urls).toContain('<loc>https://samarthbhatia.com/projects/vantage/</loc>');
    expect(urls).not.toContain('/c/');
  });

  it('publishes a robots.txt that points crawlers at the sitemap', () => {
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Sitemap: https://samarthbhatia.com/sitemap-index.xml');
  });

  it('publishes an llms.txt naming the real person and a real, live link', () => {
    const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8');
    expect(llms).toContain('Samarth Bhatia');
    expect(llms).toContain('https://github.com/darthrevan030');
  });

  it('serves a real 1200x630 og:image instead of a 404', async () => {
    const ogPath = join(DIST, 'og.png');
    expect(existsSync(ogPath)).toBe(true);
    // A parseable PNG with the exact og:image dimensions, not just a
    // nonempty file — catches a corrupt or wrongly-sized regeneration.
    const meta = await sharp(ogPath).metadata();
    expect(meta.format).toBe('png');
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});

describe('contact PII guard', () => {
  it('renders a real resume page (guards against passing on empty output)', () => {
    expect(resume).toContain('Nanyang Technological University');
    expect(resume).toContain('Business Analyst Intern');
  });

  it('never publishes a phone number on the resume page', () => {
    // Pattern, not the literal number: keeps the number out of source
    // entirely, and catches ANY Singapore mobile/landline, with or without +65.
    const phone = /(\+65[\s-]?)?\b[689]\d{3}[\s-]?\d{4}\b/;
    expect(resume).not.toMatch(phone);
  });

  it('never publishes the email address in plain text', () => {
    expect(resume).not.toContain('samarth009@e.ntu.edu.sg');
    expect(resume).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  });

  it('still includes the email, entity-encoded, so it remains usable', () => {
    // Encoded "mailto:" — proves the contact link exists rather than the
    // plain-text assertions above passing because the email vanished.
    const encodedMailto = Array.from('mailto:')
      .map((c) => `&#${c.codePointAt(0)};`)
      .join('');
    expect(resume).toContain(encodedMailto);
  });
});
