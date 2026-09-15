import { describe, it, expect } from 'vitest';
import { encodeEntities, obfuscateEmail } from '../src/lib/email';

const EMAIL = 'samarth009@e.ntu.edu.sg';

describe('encodeEntities', () => {
  it('encodes each character as a numeric HTML entity', () => {
    // Independently derived: 'a' is U+0061 (97), 'b' U+0062 (98).
    expect(encodeEntities('ab')).toBe('&#97;&#98;');
  });

  it('encodes the @ sign, which is what harvesters match on', () => {
    expect(encodeEntities('@')).toBe('&#64;');
  });

  it('returns an empty string for empty input', () => {
    expect(encodeEntities('')).toBe('');
  });
});

describe('obfuscateEmail', () => {
  it('produces href and text that contain no literal address', () => {
    const { href, text } = obfuscateEmail(EMAIL);

    // The whole point: a naive /\S+@\S+/ scrape of the output finds nothing.
    expect(href).not.toContain(EMAIL);
    expect(text).not.toContain(EMAIL);
    expect(href).not.toContain('@');
    expect(text).not.toContain('@');
    expect(text).not.toMatch(/\S+@\S+/);
  });

  it('decodes back to the original address', () => {
    // Proves obfuscation is lossless — a broken encoder would fail here
    // even though the "contains no @" assertions above would still pass.
    const { text } = obfuscateEmail(EMAIL);
    const decoded = text.replace(/&#(\d+);/g, (_m, code) =>
      String.fromCodePoint(Number(code)),
    );
    expect(decoded).toBe(EMAIL);
  });

  it('builds a mailto href that decodes to a usable link', () => {
    const { href } = obfuscateEmail(EMAIL);
    const decoded = href.replace(/&#(\d+);/g, (_m, code) =>
      String.fromCodePoint(Number(code)),
    );
    expect(decoded).toBe(`mailto:${EMAIL}`);
  });
});
