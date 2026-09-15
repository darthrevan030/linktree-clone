import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { fetch as undiciFetch } from 'undici';

// github.ts imports `fetch` from undici (not the global), so mock the module.
// Only the network call is replaced; the real Agent class is kept so the
// dispatcher guard test below checks a genuine instance.
const { fetchMock } = vi.hoisted(() => ({
  fetchMock: vi.fn<typeof undiciFetch>(),
}));

vi.mock('undici', async (importOriginal) => {
  const actual = await importOriginal<typeof import('undici')>();
  return { ...actual, fetch: fetchMock };
});

import { Agent } from 'undici';
import { fetchRepoStats, statsLabel, __clearCache } from '../src/lib/github';

type UndiciResponse = Awaited<ReturnType<typeof undiciFetch>>;

const REPO = 'darthrevan030/Cloud-Janitor';

function jsonResponse(body: unknown, ok = true, status = 200): UndiciResponse {
  return { ok, status, json: async () => body } as unknown as UndiciResponse;
}

function initOf(callIndex = 0) {
  const init = fetchMock.mock.calls[callIndex]?.[1];
  expect(init).toBeDefined();
  return init!;
}

describe('fetchRepoStats', () => {
  beforeEach(() => {
    __clearCache();
    fetchMock.mockReset();
  });

  it('parses stars, language and pushed_at from a 200 response', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        stargazers_count: 42,
        language: 'Python',
        pushed_at: '2026-07-01T00:00:00Z',
      }),
    );

    const stats = await fetchRepoStats(REPO, undefined);

    // Compared against independently written expected values, not a second call.
    expect(stats).toEqual({
      stars: 42,
      language: 'Python',
      pushedAt: '2026-07-01T00:00:00Z',
    });
  });

  it.each([
    ['404 not found', 404],
    ['500 server error', 500],
    ['403 rate limit', 403],
  ])('returns null on %s', async (_name, status) => {
    fetchMock.mockResolvedValue(jsonResponse({}, false, status));
    expect(await fetchRepoStats(REPO, undefined)).toBeNull();
  });

  it('returns null when fetch throws (network failure)', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNRESET'));
    expect(await fetchRepoStats(REPO, undefined)).toBeNull();
  });

  it('returns null when a 200 body is not a repo object', async () => {
    // A proxy or captive portal can return 200 with unrelated JSON.
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Not Found' }));
    expect(await fetchRepoStats(REPO, undefined)).toBeNull();
  });

  it('issues exactly one request for repeated lookups of the same repo', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ stargazers_count: 7, language: 'Go' }));

    await fetchRepoStats(REPO, undefined);
    await fetchRepoStats(REPO, undefined);
    await fetchRepoStats(REPO, undefined);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('omits the Authorization header entirely when no token is set', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ stargazers_count: 1 }));

    await fetchRepoStats(REPO, undefined);

    const headers = initOf().headers as Record<string, string>;
    expect(headers).toBeDefined();
    expect('Authorization' in headers).toBe(false);
  });

  it('sends a Bearer Authorization header when a token is set', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ stargazers_count: 1 }));

    await fetchRepoStats(REPO, 'ghp_example');

    const headers = initOf().headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer ghp_example');
  });

  it('routes requests through a dedicated undici Agent (keep-alive fix)', async () => {
    // Guards the Windows libuv crash fix. Without an explicit dispatcher the
    // request falls back to a keep-alive pool, which reintroduces the
    // UV_HANDLE_CLOSING abort at process exit on ~60% of local builds.
    fetchMock.mockResolvedValue(jsonResponse({ stargazers_count: 1 }));

    await fetchRepoStats(REPO, undefined);

    expect(initOf().dispatcher).toBeInstanceOf(Agent);
  });
});

describe('statsLabel', () => {
  it('shows stars and language when the repo has stars', () => {
    expect(statsLabel({ stars: 12, language: 'Python', pushedAt: null })).toBe('★ 12 · Python');
  });

  it('omits a zero star count rather than advertising "★ 0"', () => {
    expect(statsLabel({ stars: 0, language: 'TypeScript', pushedAt: null })).toBe('TypeScript');
  });

  it('shows stars alone when the language is unknown', () => {
    expect(statsLabel({ stars: 3, language: null, pushedAt: null })).toBe('★ 3');
  });

  it('returns null when there is nothing worth showing', () => {
    expect(statsLabel({ stars: 0, language: null, pushedAt: null })).toBeNull();
    expect(statsLabel(null)).toBeNull();
  });
});
