import type { APIRoute, GetStaticPaths } from 'astro';
import { buildEnv, readCardConfig } from '../../../lib/card';
import { contactVCard, VCARD_HEADERS } from '../../../lib/contact';

/** Only generated when CARD_KEY and CONTACT_PHONE are both set (see lib/card.ts). */
export const getStaticPaths = (() => {
  const card = readCardConfig(buildEnv());
  return card ? [{ params: { key: card.key }, props: { phone: card.phone } }] : [];
}) satisfies GetStaticPaths;

/** Private "Save contact" file for NFC card taps — includes the phone number. */
export const GET: APIRoute = async ({ props }) =>
  new Response(await contactVCard(props.phone as string), { headers: VCARD_HEADERS });
