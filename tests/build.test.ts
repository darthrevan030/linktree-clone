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

  it('builds a detail page for every showcase project and none for the rest', () => {
    for (const slug of ['vantage', 'cloud-janitor', 'not-just-black', 'trippy-find']) {
      expect(existsSync(join(DIST, 'projects', slug, 'index.html'))).toBe(true);
    }
    // Negative case: a non-showcase project must NOT get a page.
    for (const slug of ['home-lab', 'tinylink', 'ipms']) {
      expect(existsSync(join(DIST, 'projects', slug, 'index.html'))).toBe(false);
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
