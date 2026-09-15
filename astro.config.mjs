// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

/**
 * Local mirror of the PostHog rewrites in vercel.json.
 *
 * On Vercel, /insights/* is rewritten to PostHog's EU hosts. That rewrite does
 * not exist under `astro dev`, so without this every analytics request 404s
 * locally and PostHog never sees an event. Keep the order and targets in sync
 * with vercel.json: the more specific /static and /array rules come first.
 */
const posthogProxy = {
  '/insights/static': {
    target: 'https://eu-assets.i.posthog.com',
    changeOrigin: true,
    rewrite: (/** @type {string} */ path) => path.replace(/^\/insights/, ''),
  },
  '/insights/array': {
    target: 'https://eu-assets.i.posthog.com',
    changeOrigin: true,
    rewrite: (/** @type {string} */ path) => path.replace(/^\/insights/, ''),
  },
  '/insights': {
    target: 'https://eu.i.posthog.com',
    changeOrigin: true,
    rewrite: (/** @type {string} */ path) => path.replace(/^\/insights/, ''),
  },
};

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: { proxy: posthogProxy },
  },
});
