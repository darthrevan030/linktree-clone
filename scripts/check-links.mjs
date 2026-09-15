#!/usr/bin/env node
/**
 * npm run check:links
 *
 * Walks every URL in the site's data files and project records and reports
 * anything that does not respond successfully.
 *
 * Deliberately a MANUAL command, not a build or CI gate: third-party sites go
 * down for reasons unrelated to a deploy, and a build that fails because PyPI
 * hiccupped is worse than a briefly stale link.
 *
 * Exits 1 if any link is broken, so it composes in a shell if you want it to.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
// Same fix as src/lib/github.ts: keep-alive disabled, or Node 24 on Windows
// can abort at exit with a libuv UV_HANDLE_CLOSING assertion.
import { fetch, Agent } from 'undici';

const ROOT = process.cwd();
const SOURCES = [
  ...readdirSync(join(ROOT, 'src/data')).map((f) => join('src/data', f)),
  ...readdirSync(join(ROOT, 'src/content/projects')).map((f) => join('src/content/projects', f)),
];

/** Our own origin isn't a third-party link, and won't resolve until deployed. */
const SKIP_HOSTS = new Set(['samarthbhatia.com', 'www.samarthbhatia.com']);

/**
 * LinkedIn answers non-browser requests with 999 by design. It is not a
 * broken link, so treat it as reachable rather than a false alarm.
 */
const TOLERATED = new Map([['www.linkedin.com', 999]]);

const agent = new Agent({ pipelining: 0 });

function collectUrls() {
  const urls = new Map(); // url -> first file it appears in
  const pattern = /https?:\/\/[^\s'"`)<>\]]+/g;
  for (const file of SOURCES) {
    const text = readFileSync(join(ROOT, file), 'utf8');
    for (const match of text.matchAll(pattern)) {
      const url = match[0].replace(/[.,;]+$/, '');
      if (SKIP_HOSTS.has(new URL(url).hostname)) continue;
      if (!urls.has(url)) urls.set(url, file);
    }
  }
  return urls;
}

async function probe(url) {
  const init = {
    redirect: 'follow',
    dispatcher: agent,
    headers: { 'User-Agent': 'Mozilla/5.0 (link-check; samarthbhatia.com)' },
    signal: AbortSignal.timeout(15_000),
  };
  try {
    // HEAD first; some servers reject it (405/403), so fall back to GET.
    let res = await fetch(url, { ...init, method: 'HEAD' });
    if (!res.ok) res = await fetch(url, { ...init, method: 'GET' });
    return res.status;
  } catch (err) {
    return `ERR ${err.cause?.code ?? err.name}`;
  }
}

const urls = collectUrls();
console.log(`Checking ${urls.size} unique links...\n`);

const results = await Promise.all(
  [...urls].map(async ([url, file]) => ({ url, file, status: await probe(url) })),
);

let broken = 0;
for (const { url, file, status } of results.sort((a, b) => a.url.localeCompare(b.url))) {
  const tolerated = TOLERATED.get(new URL(url).hostname) === status;
  const ok = (typeof status === 'number' && status >= 200 && status < 400) || tolerated;
  if (!ok) broken++;
  const mark = ok ? (tolerated ? '~' : '✓') : '✗';
  const note = tolerated ? ' (expected anti-bot response)' : '';
  console.log(`${mark} ${String(status).padEnd(8)} ${url}${note}`);
  if (!ok) console.log(`             in ${file}`);
}

await agent.close();

console.log(`\n${urls.size - broken}/${urls.size} reachable.`);
process.exitCode = broken > 0 ? 1 : 0;
