/**
 * Site-wide identity and SEO defaults.
 *
 * NOTE: the phone number is deliberately NOT stored here. It lives only in the
 * CONTACT_PHONE env var in Vercel and is used solely for the private NFC card
 * page (see src/lib/card.ts). tests/build.test.ts asserts no phone-shaped
 * string reaches the public build.
 */
export const profile = {
  name: 'Samarth Bhatia',
  firstName: 'Samarth',
  lastName: 'Bhatia',
  tagline: 'Computer Engineering @ NTU Singapore',
  bio: 'Computer Engineering undergrad at NTU with a second major in Business. I build production-minded side projects — portfolio analytics, AWS tooling, browser extensions — and care about the boring parts: access control, CI, and not shipping things that silently break.',
  location: 'Singapore',
  nationality: 'Singaporean',

  /** What you're doing right now — shown on the hub and used in "Save contact". */
  current: {
    role: 'Product Lead',
    org: 'Money Pasar',
    url: 'https://moneypasar.com/',
    summary: 'Cross-border transfers and collections for Southeast Asian SMEs.',
  },

  /** Rendered obfuscated on the public page. See src/lib/email.ts */
  email: 'samarth009@e.ntu.edu.sg',

  siteUrl: 'https://samarthbhatia.com',
  resumePdf: '/Samarth-Bhatia-Resume.pdf',

  /** Used for og:image and twitter:card */
  ogImage: '/og.png',
} as const;
