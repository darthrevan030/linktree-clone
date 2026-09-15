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
 * Social profiles are NOT listed here — they live in socials.ts and appear as
 * test points, so no link shows up twice.
 *
 * `id` doubles as the PostHog event label, so keep ids stable — renaming one
 * splits its click history into two series.
 */
export const links: HubLink[] = [
  {
    id: 'money-pasar',
    label: 'Money Pasar',
    description: 'Product Lead · cross-border payments',
    url: 'https://moneypasar.com/',
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
