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
| `npm run favicons`    | Regenerate .ico and home-screen icon from favicon.svg      |

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
| Tab icon (source of truth)        | `public/favicon.svg`                   |
| What you do now (hub, contact)    | `profile.current` in `profile.ts`      |

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
`/insights/*`, so requests are first-party and survive ad blockers.

Visitors carry a persistent ID (localStorage + cookie), so one person's
pageviews, clicks and session recording stitch together and return visits are
recognised. **This sets cookies and records sessions, and there is no consent
banner** — a deliberate choice, but note that GDPR follows the visitor's
location, not the site owner's.

Tracked events:

- `link_click` — every tracked link, with `label`, `destination`, `kind`, `surface`
- `resume_download` — the PDF button
- `contact_save` — the Save contact button
- `$pageview` / `$pageleave` — automatic
- `$snapshot` — session recordings

### Session recording

`disable_session_recording: false` in `Analytics.astro` is necessary but **not
sufficient**: Session Replay must also be switched on in the PostHog project
settings, or nothing records.

Input values are masked by PostHog's defaults. The recorder bundle loads from
`/insights/static/recorder.js` and snapshots POST to `/insights/s/`, both
already covered by the existing rewrites — no `vercel.json` change needed.

Recording begins when PostHog loads, which is deferred to browser idle (2s cap),
so the first second or two of a visit is missing from the recording. That is the
price of never competing with first paint.

**The card key never reaches PostHog.** On `/c/<key>` the key is embedded in the
rrweb payload — the Meta record's `href`, captured DOM attributes — where the
property-level `scrubCardPaths` cannot see it. So on that page `before_send` also
runs `scrubCardPathsDeep` over `$snapshot_data`, rewriting every `/c/<key>` to
`/c/card`. Covered by `tests/analytics.test.ts`.

On Vercel the proxy is a rewrite in `vercel.json`. Locally, `astro.config.mjs`
mirrors the same rules in the dev server, so `npm run dev` sends real events —
tagged `environment: development` so you can filter them out in PostHog. Keep the
two sets of rules in sync. (`astro preview` has no proxy.)

**No events from automated browsers.** PostHog silently drops events from
browsers that identify as bots — including DevTools/Playwright-driven Chrome
(`navigator.webdriver` is true). If a test harness sees analytics load but
never send, that is why; real visitors are unaffected.

`contact_save` fires when someone taps **Save contact**. On the private card
page every event also carries `source: nfc-card`, and the card key is stripped
from all event properties before sending.

## Environment

Copy `.env.example` to `.env`. Set the same variables in Vercel → Settings →
Environment Variables.

- `PUBLIC_POSTHOG_KEY` — PostHog project token. Public by design.
- `GITHUB_TOKEN` — **secret**, build-time only, never `PUBLIC_`-prefixed.
  Optional: without it the build still succeeds, but repo star counts go
  missing once the unauthenticated limit (60/hr, shared across Vercel runners)
  is hit.
- `CARD_KEY`, `CONTACT_PHONE` — **private**, for the NFC card page below.

## NFC card

The card holds a plain URL — the one NFC record every phone opens natively
(Android including GrapheneOS, iPhone, anything else with NFC). It points to a
private copy of the hub whose **Save contact** includes your phone number. The
public site never shows the number.

This is an **unlisted link, not a password**: anyone who taps the card can
forward the URL. Search engines are told not to index it, it never leaks its
own URL to sites it links to, and the key is stripped from analytics.

### Set up

1. **Generate a key** (hex: no punctuation, so it's safe to paste into any
   terminal command):

   ```sh
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

2. **Add both variables in Vercel** → Settings → Environment Variables →
   Production:
   - `CARD_KEY` — the key from step 1
   - `CONTACT_PHONE` — your number as it should appear in contacts

   Redeploy. The build fails loudly if the key is too short or malformed, so
   a typo can't silently publish a guessable URL.

3. **Your card URL** is `https://samarthbhatia.com/c/<CARD_KEY>/` — keep the
   trailing `/`, it's the exact generated path. Open it on your phone first and
   confirm Save contact includes your number.

4. **Write the card** with the free *NFC Tools* app (Android or iPhone):
   Write → Add a record → URL/URI → paste the card URL → Write → hold the card
   to the phone. **Don't lock or password-protect the tag** — leaving it
   rewritable is what lets you rotate the key later. NTAG213 or larger fits the
   URL comfortably.

5. **Print a QR code of the same URL on the back** for phones without NFC or
   with NFC switched off.

### Test on real phones

Tap the card with an Android phone and an iPhone. Each should open the page,
and **Save contact** should offer to add the contact (iPhone may show a
download prompt first). Emulators can't test this — it needs real devices.

### If the link leaks

Generate a new key, replace `CARD_KEY` in Vercel, redeploy (the old URL now
404s), and rewrite the card.

### Preview locally

Add `CARD_KEY` and `CONTACT_PHONE` to `.env`, restart `npm run dev`, and open
`http://localhost:4321/c/<CARD_KEY>/`.

## After each deploy

Vercel applies `vercel.json` only on its servers, so check the live headers:

```sh
curl -sI https://samarthbhatia.com/samarth-bhatia.vcf | grep -i "content-"
curl -sI "https://samarthbhatia.com/c/<CARD_KEY>/" | grep -iE "x-robots|referrer"
```

Expect `content-type: text/vcard` and `content-disposition: attachment` on the
first, and `x-robots-tag: noindex` plus `referrer-policy: no-referrer` on the
second.

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
