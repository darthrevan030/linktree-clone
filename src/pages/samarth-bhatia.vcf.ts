import type { APIRoute } from 'astro';
import { contactVCard, VCARD_HEADERS } from '../lib/contact';

/** Public "Save contact" file — deliberately has no phone number. */
export const GET: APIRoute = async () =>
  new Response(await contactVCard(), { headers: VCARD_HEADERS });
