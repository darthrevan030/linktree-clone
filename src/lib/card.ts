/**
 * Private NFC card link.
 *
 * The physical NFC card holds https://samarthbhatia.com/c/<CARD_KEY>. That page
 * is the normal hub plus a "Save contact" file that includes the phone number.
 * It is only generated when BOTH private env vars are set in Vercel, so the
 * key and the number never live in the repository.
 *
 * This is an unlisted link, not a password: anyone who taps the card can
 * forward it. To revoke, change CARD_KEY in Vercel, redeploy, and rewrite the
 * card. See README → "NFC card".
 */

export type CardConfig = { key: string; phone: string };

type Env = Record<string, string | undefined>;

/** ~96 bits with a URL-safe base62 key of this length; unguessable. */
const MIN_KEY_LENGTH = 16;
const URL_SAFE = /^[A-Za-z0-9_-]+$/;

/**
 * Returns the card config, or null when the card page should not be built.
 * Throws on a weak or malformed key so a mistake fails the build loudly.
 */
export function readCardConfig(env: Env): CardConfig | null {
  const key = env.CARD_KEY?.trim() ?? '';
  const phone = env.CONTACT_PHONE?.trim() ?? '';

  if (!key || !phone) return null;

  if (key.length < MIN_KEY_LENGTH) {
    throw new Error(
      `CARD_KEY must be at least ${MIN_KEY_LENGTH} characters so the card URL cannot be guessed.`,
    );
  }
  if (!URL_SAFE.test(key)) {
    throw new Error('CARD_KEY may only contain letters, digits, "-" and "_" (it is used in a URL path).');
  }

  return { key, phone };
}

/** Build-time env, from Astro's loaded .env values or the process (Vercel). */
export function buildEnv(): Env {
  return {
    CARD_KEY: import.meta.env.CARD_KEY ?? process.env.CARD_KEY,
    CONTACT_PHONE: import.meta.env.CONTACT_PHONE ?? process.env.CONTACT_PHONE,
  };
}
