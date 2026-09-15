/**
 * vCard generation for the "Save contact" button.
 *
 * vCard 3.0 (RFC 2426), not 4.0: 3.0 is the version every contacts importer
 * handles — Android and GrapheneOS contacts apps, iOS, Outlook on Windows.
 * 4.0 support is still patchy in Outlook and older Android importers.
 *
 * Output rules, all tested against an independent parser (tests/vcard.test.ts):
 * - CRLF line endings, VERSION directly after BEGIN.
 * - Lines folded to <= 75 octets (RFC 2425 §5.8.1) without ever splitting a
 *   multi-byte UTF-8 character.
 * - Text values escape `\` and `,`. Newlines are collapsed to spaces rather
 *   than escaped, because some importers mishandle escaped newlines.
 */

export type ContactCard = {
  firstName: string;
  lastName: string;
  title?: string;
  org?: string;
  email?: string;
  /** Only ever set on the private card build. Never on the public card. */
  phone?: string;
  urls: { label: string; url: string }[];
  /** Raw base64 JPEG, no data: prefix. */
  photoJpegBase64?: string;
};

const MAX_OCTETS = 75;

function escapeText(value: string): string {
  return value
    .replace(/\s*[\r\n]+\s*/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .trim();
}

/**
 * Fold one logical line into physical lines of at most 75 octets each.
 * Continuation lines begin with a single space, which counts toward the limit.
 */
function fold(line: string): string {
  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  let limit = MAX_OCTETS;

  for (const char of line) {
    const bytes = Buffer.byteLength(char, 'utf8');
    if (currentBytes + bytes > limit) {
      out.push(current);
      current = ' ';
      currentBytes = 1;
      limit = MAX_OCTETS;
    }
    current += char;
    currentBytes += bytes;
  }
  out.push(current);
  return out.join('\r\n');
}

export function buildVCard(card: ContactCard): string {
  const first = card.firstName.trim();
  const last = card.lastName.trim();
  if (!first || !last) {
    throw new Error('vCard requires a non-empty first and last name');
  }

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeText(last)};${escapeText(first)};;;`,
    `FN:${escapeText(`${first} ${last}`)}`,
  ];

  if (card.title) lines.push(`TITLE:${escapeText(card.title)}`);
  if (card.org) lines.push(`ORG:${escapeText(card.org)}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeText(card.email)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${escapeText(card.phone)}`);

  // Grouped URL + X-ABLabel: iOS shows the label; other importers keep the URL
  // and ignore the label, so nothing is lost.
  card.urls.forEach(({ label, url }, i) => {
    lines.push(`item${i + 1}.URL:${url}`);
    lines.push(`item${i + 1}.X-ABLabel:${escapeText(label)}`);
  });

  if (card.photoJpegBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${card.photoJpegBase64}`);
  }

  lines.push('END:VCARD');
  return lines.map(fold).join('\r\n') + '\r\n';
}
