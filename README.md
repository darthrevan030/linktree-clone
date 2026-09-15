# samarthbhatia.com

Personal link hub, projects, and resume — a self-hosted Linktree replacement
with first-party analytics. Static Astro site on Vercel.

## Commands

| Command               | What it does                                               |
| --------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Dev server (use `astro dev --background` for background)   |
| `npm run build`       | Production build to `dist/`                                |
| `npm run preview`     | Serve the built site locally                               |
| `npm test`            | Build, then run all tests (unit + built-output)            |
| `npm run check`       | Type-check (`astro check`)                                 |
| `npm run lint`        | ESLint across `.ts`, `.astro`, and scripts                 |
| `npm run check:links` | Probe every outbound link — manual, not a CI gate          |

## Where things live

| To change…                        | Edit                                   |
| --------------------------------- | -------------------------------------- |
| Name, tagline, bio, email         | `src/data/profile.ts`                  |
| Hub page buttons                  | `src/data/links.ts`                    |
| Footer social links               | `src/data/socials.ts`                  |
| Education, jobs, skills, CCAs     | `src/data/resume.ts`                   |
| A project (resume + projects)     | `src/content/projects/<name>.md`       |
| Resume PDF download               | `public/Samarth-Bhatia-Resume.pdf`     |
| Avatar photo                      | `public/samarth-bhatia.jpg`            |
| Social preview image              | `public/og.png`                        |

Each project is **one file read by two pages**. Change a link once and both
`/resume` and `/projects` update. Set `showcase: true` to give a project its own
write-up page, built from the Markdown body.

Missing assets degrade cleanly: no avatar photo shows an initials monogram, and
no resume PDF hides the download button. Drop the file in and it appears.

Keep the full-size original photo in `public/` — no need to resize it. Before
each build, `scripts/crop-avatar.mjs` cuts a face-centred headshot from it into
`src/assets/avatar.generated.jpg` (gitignored), which Astro turns into small WebP
copies. **If you replace the photo, adjust `CROP` in that script** so it is
centred on your face.

## Resume update runbook

The **Word doc stays your working copy** — tailor it per application as usual.
This repo holds the canonical *public* resume, updated only when **facts**
change (a new role or project), never for per-application wording.

1. Update the Word doc as you already do.
2. Export a fresh, untailored PDF over `public/Samarth-Bhatia-Resume.pdf`.
   **Remove your phone number from this export first** — the file is publicly
   downloadable and indexed by search engines.
3. Paste the changed section to an AI, naming the destination:
   - a new **job or education entry** → `src/data/resume.ts`
   - a new **project** → a new file in `src/content/projects/`
     (copy an existing one for the shape)
4. `npm test` — if the schema rejects the entry, it was malformed. This is the
   safety net on AI-generated edits.
5. Push. Vercel deploys.

## Analytics

PostHog (EU), proxied through this domain via `vercel.json` rewrites on
`/insights/*`, so requests are first-party and survive ad blockers. Cookieless —
no consent banner.

Tracked events:

- `link_click` — every tracked link, with `label`, `destination`, `kind`, `surface`
- `resume_download` — the PDF button
- `$pageview` / `$pageleave` — automatic

The proxy is a **Vercel rewrite** and does not exist under `astro dev` or
`astro preview`. Verify analytics on a deployment, not locally.

## Environment

Copy `.env.example` to `.env`. Set the same variables in Vercel → Settings →
Environment Variables.

- `PUBLIC_POSTHOG_KEY` — PostHog project token. Public by design.
- `GITHUB_TOKEN` — **secret**, build-time only, never `PUBLIC_`-prefixed.
  Optional: without it the build still succeeds, but repo star counts go
  missing once the unauthenticated limit (60/hr, shared across Vercel runners)
  is hit.

## Known issue: Windows local builds

Node 24 on Windows can abort at process exit with
`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` when a keep-alive
socket is still open ([nodejs/node#56645](https://github.com/nodejs/node/issues/56645)).
The build had already succeeded when this happened, but the non-zero exit code
broke `npm test`.

Build-time fetches therefore use undici with keep-alive disabled
(`src/lib/github.ts`, `scripts/check-links.mjs`). This does not affect Vercel,
which builds on Linux. If the assertion reappears, check for a new build-time
`fetch()` that bypasses that dispatcher.

`astro check` also needs **TypeScript 6**: the TypeScript 7 native compiler does
not yet expose the API it relies on. Don't upgrade TypeScript past 6 until that
changes.
