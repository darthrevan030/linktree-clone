import { describe, it, expect } from 'vitest';
import ICAL from 'ical.js';
import { buildVCard, type ContactCard } from '../src/lib/vcard';

// ical.js is an independent parser used as the oracle: these tests check the
// output is a vCard a real importer reads back correctly, not merely that it
// "looks right". Probed beforehand: it rejects malformed cards, and it
// mishandles escaped newlines and escaped semicolons in ORG — which is why the
// generator never emits either.
function parse(text: string) {
  return new ICAL.Component(ICAL.parse(text));
}

const base: ContactCard = {
  firstName: 'Samarth',
  lastName: 'Bhatia',
  title: 'Product Lead',
  org: 'Money Pasar',
  email: 'samarth@example.com',
  urls: [
    { label: 'Website', url: 'https://samarthbhatia.com' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/samarth-bhatia-03-/' },
  ],
};

describe('buildVCard', () => {
  it('produces a vCard 3.0 that an independent parser reads back exactly', () => {
    const card = parse(buildVCard(base));

    expect(card.name).toBe('vcard');
    expect(card.getFirstPropertyValue('version')).toBe('3.0');
    expect(card.getFirstPropertyValue('fn')).toBe('Samarth Bhatia');
    expect(card.getFirstPropertyValue('n')).toEqual(['Bhatia', 'Samarth', '', '', '']);
    expect(card.getFirstPropertyValue('title')).toBe('Product Lead');
    expect(card.getFirstPropertyValue('org')).toBe('Money Pasar');
    expect(card.getFirstPropertyValue('email')).toBe('samarth@example.com');
  });

  it('puts VERSION immediately after BEGIN, as strict importers require', () => {
    const lines = buildVCard(base).split('\r\n');
    expect(lines[0]).toBe('BEGIN:VCARD');
    expect(lines[1]).toBe('VERSION:3.0');
  });

  it('includes TEL with the exact number when a phone is given', () => {
    const card = parse(buildVCard({ ...base, phone: '+65 9000 0000' }));
    const tel = card.getFirstProperty('tel');
    expect(tel?.getFirstValue()).toBe('+65 9000 0000');
    expect(String(tel?.getParameter('type')).toLowerCase()).toContain('cell');
  });

  it('omits TEL entirely when no phone is given (public card)', () => {
    const text = buildVCard(base);
    expect(text).not.toMatch(/^TEL/m);
    expect(parse(text).getFirstProperty('tel')).toBeNull();
  });

  it('uses CRLF line endings only, and ends with CRLF', () => {
    const text = buildVCard({ ...base, phone: '+65 9000 0000' });
    expect(text.endsWith('END:VCARD\r\n')).toBe(true);
    expect(text.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('folds every physical line to at most 75 octets, without splitting characters', () => {
    // Multi-byte characters placed so a naive byte-slice would cut them in half.
    const title = 'Café naïve × résumé — '.repeat(8).trim();
    const photo = 'A'.repeat(5000);
    const text = buildVCard({ ...base, title, photoJpegBase64: photo });

    for (const line of text.split('\r\n')) {
      expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
      expect(line).not.toContain('�');
    }

    const card = parse(text);
    expect(card.getFirstPropertyValue('title')).toBe(title);
    expect(card.getFirstProperty('photo')?.getFirstValue()).toEqual(
      expect.objectContaining({ value: photo }),
    );
  });

  it('escapes commas so they survive the round trip', () => {
    const text = buildVCard({ ...base, title: 'Product Lead, Payments' });
    // Assert the raw escape itself: ical.js tolerates an UNescaped comma in a
    // single text value, so a round trip alone passes even with escaping
    // removed. Stricter importers (Outlook, some Android contacts apps) split it.
    expect(text).toContain('TITLE:Product Lead\\, Payments\r\n');
    expect(parse(text).getFirstPropertyValue('title')).toBe('Product Lead, Payments');
  });

  it('collapses newlines in values instead of emitting them', () => {
    const text = buildVCard({ ...base, title: 'Product\nLead' });
    expect(parse(text).getFirstPropertyValue('title')).toBe('Product Lead');
  });

  it('keeps URLs in order with their labels', () => {
    const card = parse(buildVCard(base));
    const urls = card.getAllProperties('url').map((p) => p.getFirstValue());
    const labels = card.getAllProperties('x-ablabel').map((p) => p.getFirstValue());
    expect(urls).toEqual([
      'https://samarthbhatia.com',
      'https://www.linkedin.com/in/samarth-bhatia-03-/',
    ]);
    expect(labels).toEqual(['Website', 'LinkedIn']);
  });

  it.each([
    ['empty first name', { ...base, firstName: '' }],
    ['blank last name', { ...base, lastName: '   ' }],
  ])('rejects a card with a %s', (_name, card) => {
    expect(() => buildVCard(card)).toThrow();
  });
});
