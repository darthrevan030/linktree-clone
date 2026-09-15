export type HubLink = {
  id: string;
  label: string;
  description: string;
  url: string;
  featured?: boolean;
};

/**
 * The hub page's main buttons, in display order.
 *
 * `id` doubles as the PostHog event label, so keep ids stable — renaming one
 * splits its click history into two series.
 */
export const links: HubLink[] = [
  {
    id: 'projects',
    label: 'Projects',
    description: 'Nine things I built, and why',
    url: '/projects',
    featured: true,
  },
  {
    id: 'resume',
    label: 'Resume',
    description: 'Experience, education, skills',
    url: '/resume',
    featured: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    description: '@darthrevan030',
    url: 'https://github.com/darthrevan030',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Connect with me',
    url: 'https://www.linkedin.com/in/samarth-bhatia-03-/',
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
