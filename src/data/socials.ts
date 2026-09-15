export type Social = {
  id: string;
  label: string;
  url: string;
  handle: string;
};

/** Icon row — compact identity links shown on every page footer and the hub. */
export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/darthrevan030',
    handle: 'darthrevan030',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/samarth-bhatia-03-/',
    handle: 'samarth-bhatia-03-',
  },
];
