/**
 * Email obfuscation for the public resume page.
 *
 * This is deliberately modest: it defeats the naive regex harvesters that
 * scrape indexed pages for `\S+@\S+`, and nothing more. A determined scraper
 * that renders HTML will still read it. That trade is fine — the goal is to
 * avoid being low-hanging fruit, not to hide the address from humans.
 *
 * Encoding to numeric HTML entities works without JavaScript, which matters:
 * a JS-only mailto is invisible to anyone with scripts blocked.
 */

/**
 * Encode every character as a numeric HTML entity.
 * Render the result with Astro's `set:html` so the browser decodes it.
 */
export function encodeEntities(value: string): string {
  return Array.from(value)
    .map((char) => `&#${char.codePointAt(0)};`)
    .join('');
}

/**
 * Build the pieces needed to render an obfuscated mailto link.
 * Both the href and the visible text are entity-encoded.
 */
export function obfuscateEmail(email: string): { href: string; text: string } {
  return {
    href: encodeEntities(`mailto:${email}`),
    text: encodeEntities(email),
  };
}
