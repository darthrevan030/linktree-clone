import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { profile } from '../data/profile';
import { socials } from '../data/socials';
import { buildVCard } from './vcard';

/** Written by scripts/crop-avatar.mjs before every build. */
const AVATAR = 'src/assets/avatar.generated.jpg';

/**
 * Contact photo for the vCard: a small JPEG, so the file stays light enough
 * for every contacts importer. Omitted when the avatar has not been generated.
 */
async function contactPhoto(): Promise<string | undefined> {
  if (!existsSync(AVATAR)) return undefined;
  const jpeg = await sharp(AVATAR).resize(256, 256).jpeg({ quality: 82 }).toBuffer();
  return jpeg.toString('base64');
}

/**
 * The "Save contact" file.
 *
 * @param phone only passed on the private NFC card build — never publicly.
 */
export async function contactVCard(phone?: string): Promise<string> {
  return buildVCard({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.current.role,
    org: profile.current.org,
    email: profile.email,
    phone,
    urls: [
      { label: 'Website', url: profile.siteUrl },
      ...socials.map((s) => ({ label: s.label, url: s.url })),
    ],
    photoJpegBase64: await contactPhoto(),
  });
}

/** Headers are also set in vercel.json; these cover `astro dev` and preview. */
export const VCARD_HEADERS = {
  'Content-Type': 'text/vcard; charset=utf-8',
  'Content-Disposition': 'attachment; filename="Samarth-Bhatia.vcf"',
};
