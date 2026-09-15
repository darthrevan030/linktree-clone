import { describe, it, expect } from 'vitest';
import {
  isOutbound,
  toLinkEvent,
  toDataAttrs,
  LINK_CLICK_EVENT,
  scrubCardPaths,
  type TrackedLink,
} from '../src/lib/analytics';

const externalLink: TrackedLink = {
  id: 'cloud-janitor',
  label: 'Cloud Janitor',
  url: 'https://pypi.org/project/cloud-janitor/',
  kind: 'project',
  surface: '/projects',
};

const internalLink: TrackedLink = {
  id: 'resume',
  label: 'Resume',
  url: '/resume',
  kind: 'hub',
  surface: '/',
};

describe('isOutbound', () => {
  it.each([
    ['https://github.com/darthrevan030', true],
    ['http://example.com', true],
    ['//cdn.example.com/x.png', true],
    ['mailto:someone@example.com', true],
    ['/resume', false],
    ['/projects/vantage', false],
    ['#skills', false],
  ])('classifies %s as outbound=%s', (url, expected) => {
    expect(isOutbound(url)).toBe(expected);
  });
});

describe('toLinkEvent', () => {
  it('builds the full payload for an outbound link', () => {
    // Expected object written independently of the implementation.
    expect(toLinkEvent(externalLink)).toEqual({
      event: 'link_click',
      label: 'cloud-janitor',
      destination: 'https://pypi.org/project/cloud-janitor/',
      kind: 'project',
      surface: '/projects',
      outbound: true,
    });
  });

  it('marks internal navigation as not outbound', () => {
    expect(toLinkEvent(internalLink).outbound).toBe(false);
  });

  it('keeps the full href so two links to one host stay distinct', () => {
    const repo = toLinkEvent({ ...externalLink, id: 'a', url: 'https://github.com/u/r' });
    const releases = toLinkEvent({
      ...externalLink,
      id: 'b',
      url: 'https://github.com/u/r/releases',
    });
    expect(repo.destination).not.toBe(releases.destination);
  });

  it('exports the event name it uses', () => {
    expect(toLinkEvent(externalLink).event).toBe(LINK_CLICK_EVENT);
  });
});

describe('toDataAttrs', () => {
  it('emits every attribute the delegated listener reads', () => {
    const attrs = toDataAttrs(externalLink);

    // The listener in Analytics.astro reads exactly these keys. If one is
    // renamed here without updating the listener, tracking silently dies —
    // so assert the contract explicitly.
    expect(Object.keys(attrs).sort()).toEqual([
      'data-ph-dest',
      'data-ph-event',
      'data-ph-kind',
      'data-ph-label',
      'data-ph-surface',
    ]);

    expect(attrs['data-ph-label']).toBe('cloud-janitor');
    expect(attrs['data-ph-dest']).toBe('https://pypi.org/project/cloud-janitor/');
    expect(attrs['data-ph-event']).toBe('link_click');

    for (const value of Object.values(attrs)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('scrubCardPaths', () => {
  const KEY = 'k8Tq2xVn7LpR4mWz9cYb';

  it('replaces the card key in every string property, wherever it appears', () => {
    const scrubbed = scrubCardPaths({
      $current_url: `https://samarthbhatia.com/c/${KEY}/?utm=x`,
      $pathname: `/c/${KEY}/`,
      destination: `/c/${KEY}/samarth-bhatia.vcf`,
    });
    // Expected values written out independently.
    expect(scrubbed).toEqual({
      $current_url: 'https://samarthbhatia.com/c/card/?utm=x',
      $pathname: '/c/card/',
      destination: '/c/card/samarth-bhatia.vcf',
    });
    expect(JSON.stringify(scrubbed)).not.toContain(KEY);
  });

  it('leaves non-card URLs and non-string values untouched', () => {
    const props = {
      $current_url: 'https://samarthbhatia.com/projects/cloud-janitor/',
      $pathname: '/resume/',
      clicks: 3,
      flag: true,
      nothing: null,
    };
    expect(scrubCardPaths(props)).toEqual(props);
  });

  it('does not treat unrelated paths that merely contain "c" as card paths', () => {
    expect(scrubCardPaths({ u: '/projects/cloud-janitor/' }).u).toBe('/projects/cloud-janitor/');
    expect(scrubCardPaths({ u: 'https://example.com/abc/def' }).u).toBe('https://example.com/abc/def');
  });
});
