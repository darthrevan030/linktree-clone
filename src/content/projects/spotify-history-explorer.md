---
name: Spotify History Explorer
tagline: Privacy-first, fully client-side visualiser for Spotify extended streaming history.
start: "2025"
context: Personal Project
repo: darthrevan030/Spotify-Explorer
order: 5
showcase: true
links:
  - label: Live
    url: https://spotistats.samarthbhatia.dev/
  - label: GitHub
    url: https://github.com/darthrevan030/Spotify-Explorer
tech:
  - React 18
  - TypeScript
  - Vite
  - Chart.js
  - CSS Modules
resumeBullets:
  - "Built a privacy-first client-side React app that visualises Spotify extended streaming history by year, month, and week — all data processing happens in-browser with no server uploads"
  - "Implemented three-tier time granularity with hierarchical navigation, per-period statistics (top artists, tracks, shuffle/skip rates, peak listening hours), and interactive Chart.js bar charts"
  - "Designed for full WCAG AA accessibility — visible focus rings, ARIA roles, keyboard navigation, prefers-reduced-motion support, and minimum 44×44px touch targets"
---

## Privacy by architecture, not policy

Spotify's extended streaming history export is a detailed record of what you
listen to and when. Rather than ask for trust, the app never has the choice
to violate it: every parse and aggregation step runs client-side in the
browser, nothing is uploaded to a server, and there's no backend to leak from
in the first place.

## Three tiers of granularity

Your history is navigable by **year, month, and week**, drilling down through
a hierarchical view. Each period surfaces its own stats — top artists, top
tracks, shuffle and skip rates, and peak listening hours — rendered as
interactive Chart.js bar charts.

## Built to WCAG AA

Accessibility wasn't an afterthought pass: visible focus rings, ARIA roles on
interactive elements, full keyboard navigation, `prefers-reduced-motion`
support, and a minimum 44×44px touch target on everything tappable.
