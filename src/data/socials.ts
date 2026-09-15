export type Social = {
  id: string;
  label: string;
  url: string;
  handle: string;
};

/**
 * Social profiles. Shown as test points on the hub, in the footer of every
 * page, on /resume, and included in "Save contact".
 *
 * To add one, copy an entry. Keep `id` lowercase and stable (it is the
 * analytics label). Run `npm run check:links` afterwards to confirm the URL
 * resolves. For example:
 *
 *   {
 *     id: 'instagram',
 *     label: 'Instagram',
 *     url: 'https://www.instagram.com/your-handle/',
 *     handle: 'your-handle',
 *   },
 */
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
