/**
 * Build-time GitHub repo stats.
 *
 * Three properties this module must preserve — all three are tested:
 *
 *  1. FAIL-SOFT. Any non-200, malformed body, or thrown network error returns
 *     null. A GitHub outage degrades a star count; it must never fail a deploy.
 *  2. CACHED PER BUILD. One request per unique repo, however many times it is
 *     referenced.
 *  3. TOKEN-OPTIONAL. GITHUB_TOKEN may be absent. Unauthenticated calls are
 *     limited to 60/hr per IP and Vercel build runners share IPs, so stats
 *     will be intermittently missing until a token exists. Callers must treat
 *     stats as an enhancement, never as part of the layout skeleton.
 */

import { fetch, Agent } from 'undici';

export type RepoStats = {
  stars: number;
  language: string | null;
  pushedAt: string | null;
};

const cache = new Map<string, RepoStats | null>();

/**
 * Keep-alive DISABLED (pipelining: 0) on purpose.
 *
 * On Windows with Node 24, a keep-alive TLS socket still open when the build
 * process exits races libuv's handle teardown and aborts with
 * `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` (nodejs/node#56645).
 * Measured here: 3/5 builds crashed with keep-alive, 0/5 without the fetch.
 *
 * undici's OWN fetch is used rather than Node's built-in one: passing an
 * npm-undici Agent to the built-in fetch fails on a major-version mismatch
 * (Node bundles undici 7; this is 8), and fetchRepoStats's fail-soft catch
 * would turn that into silently-null stats on every build.
 */
const agent = new Agent({ pipelining: 0 });

/** Exposed for tests; not used by the site. */
export function __clearCache(): void {
  cache.clear();
}

function buildHeaders(token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'samarthbhatia.com-build',
  };
  // Only send Authorization when a token actually exists — an empty or
  // malformed header makes GitHub reject the request outright, which would
  // be worse than being anonymous.
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Fetch stats for "owner/name". Returns null on any failure.
 *
 * @param repo  "owner/name"
 * @param token optional PAT; defaults to process.env.GITHUB_TOKEN
 */
export async function fetchRepoStats(
  repo: string,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<RepoStats | null> {
  if (cache.has(repo)) return cache.get(repo) ?? null;

  let stats: RepoStats | null = null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: buildHeaders(token),
      dispatcher: agent,
    });

    if (res.ok) {
      const body = (await res.json()) as Record<string, unknown>;
      // Guard the shape rather than trusting it: a proxy or error page can
      // return 200 with something that is not a repo object.
      if (typeof body?.stargazers_count === 'number') {
        stats = {
          stars: body.stargazers_count,
          language: typeof body.language === 'string' ? body.language : null,
          pushedAt: typeof body.pushed_at === 'string' ? body.pushed_at : null,
        };
      }
    }
  } catch {
    stats = null;
  }

  cache.set(repo, stats);
  return stats;
}
