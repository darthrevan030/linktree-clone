export type HubLink = {
  id: string;
  label: string;
  description: string;
  url: string;
};

/**
 * The hub's main links, drawn as the pins of chip U1. Order = pin number
 * (pin 1 is top-left, counting counter-clockwise like a real DIP chip).
 *
 * Social profiles live in socials.ts and appear as test points. Listing one
 * here too is deliberate, not a duplicate to clean up: it is promoted to a
 * pin *and* kept as a test point, so it is reachable from the top of the
 * board and from the bottom. Reuse the social's `id` — `kind` ("hub" vs
 * "social") keeps the two apart in PostHog.
 *
 * `id` doubles as the PostHog event label, so keep ids stable — renaming one
 * splits its click history into two series.
 */
export const links: HubLink[] = [
  {
    id: 'money-pasar',
    label: 'Money Pasar',
    description: 'Cross-border payments for SMEs',
    url: 'https://moneypasar.com/',
  },
  {
    id: 'photography-instagram',
    label: 'Photography',
    description: 'Photos I take, on Instagram',
    url: 'https://www.instagram.com/samarthjpg/',
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Nine things I built, and why',
    url: '/projects',
  },
  {
    id: 'resume',
    label: 'Resume',
    description: 'Experience, education, skills',
    url: '/resume',
  },
  {
    id: 'vantage',
    label: 'Vantage',
    description: 'Multi-currency portfolio tracker',
    url: 'https://vantage.samarthbhatia.dev/',
  },
  {
    id: 'cloud-janitor',
    label: 'Cloud Janitor',
    description: 'AWS remediation agents on PyPI',
    url: 'https://pypi.org/project/cloud-janitor/',
  },
];
