import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.remember/', '.dist/', '.vercel/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Plain Node scripts are not type-checked, so declare Node's runtime globals.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
];
