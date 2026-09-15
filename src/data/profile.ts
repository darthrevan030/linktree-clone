/**
 * Site-wide identity and SEO defaults.
 *
 * NOTE: the phone number is deliberately NOT stored here. The public site
 * never renders it, and this repo may be public — so the number does not
 * belong in source at all. See `tests/pii.test.ts`, which asserts no
 * phone-shaped string reaches the built HTML.
 */
export const profile = {
  name: 'Samarth Bhatia',
  tagline: 'Computer Engineering @ NTU Singapore',
  bio: 'Computer Engineering undergrad at NTU with a second major in Business. I build production-minded side projects — portfolio analytics, AWS tooling, browser extensions — and care about the boring parts: access control, CI, and not shipping things that silently break.',
  location: 'Singapore',
  nationality: 'Singaporean',

  /** Rendered obfuscated on the public page. See src/lib/email.ts */
  email: 'samarth009@e.ntu.edu.sg',

  siteUrl: 'https://samarthbhatia.com',
  resumePdf: '/Samarth-Bhatia-Resume.pdf',

  /** Used for og:image and twitter:card */
  ogImage: '/og.png',
} as const;
