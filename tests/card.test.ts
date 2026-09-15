import { describe, it, expect } from 'vitest';
import { readCardConfig } from '../src/lib/card';

const STRONG_KEY = 'k8Tq2xVn7LpR4mWz9cYb';

describe('readCardConfig', () => {
  it('returns the key and phone when both are set', () => {
    expect(readCardConfig({ CARD_KEY: STRONG_KEY, CONTACT_PHONE: '+65 9000 0000' })).toEqual({
      key: STRONG_KEY,
      phone: '+65 9000 0000',
    });
  });

  it('trims surrounding whitespace pasted into env settings', () => {
    expect(readCardConfig({ CARD_KEY: ` ${STRONG_KEY}\n`, CONTACT_PHONE: ' +65 9000 0000 ' })).toEqual(
      { key: STRONG_KEY, phone: '+65 9000 0000' },
    );
  });

  it.each([
    ['no variables', {}],
    ['only the key', { CARD_KEY: STRONG_KEY }],
    ['only the phone', { CONTACT_PHONE: '+65 9000 0000' }],
    ['blank values', { CARD_KEY: '  ', CONTACT_PHONE: '' }],
  ])('returns null with %s — no card page is built', (_name, env) => {
    expect(readCardConfig(env)).toBeNull();
  });

  it.each([
    ['too short to resist guessing', 'abc123'],
    ['contains a slash, which breaks the URL path', 'k8Tq2xVn7LpR/4mWz9cYb'],
    ['contains a space', 'k8Tq2xVn7LpR 4mWz9cYb'],
  ])('throws when the key is %s', (_name, key) => {
    // Fail the build loudly rather than silently publish a guessable or broken
    // card URL — a key typo must never quietly expose the phone number.
    expect(() => readCardConfig({ CARD_KEY: key, CONTACT_PHONE: '+65 9000 0000' })).toThrow();
  });
});
