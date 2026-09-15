---
name: Vantage
tagline: Multi-asset, multi-currency portfolio tracker that separates FX movement from real asset returns.
start: May 2026
end: Jun 2026
context: SummerBuild 2026
repo: darthrevan030/Vantage-Summerbuild-2026
order: 1
showcase: true
links:
  - label: Live
    url: https://vantage.samarthbhatia.dev/
  - label: GitHub
    url: https://github.com/darthrevan030/Vantage-Summerbuild-2026
tech:
  - Next.js 16
  - React 19
  - TypeScript
  - Supabase
  - Tailwind CSS v4
  - Vercel
  - Anthropic API
  - OpenRouter
resumeBullets:
  - "Led 3-person team building production-grade multi-asset, multi-currency portfolio SaaS tracking equities, ETFs, crypto, gold, bonds, real estate, and cash across multiple brokers — SGD base currency"
  - "Engineered deterministic FX-vs-asset gain decomposition algorithm mathematically isolating currency movement from asset returns, a feature absent in incumbent tools (Moomoo, StocksCafe, Syfe)"
  - "Architected four-layer full stack with React Server Components for zero-waterfall initial load, Supabase Postgres with Row-Level Security enforced at the PostgREST layer, and live market data from EODHD, CoinGecko, GoldAPI, Finnhub, and Frankfurter"
  - "Built dual-provider AI analyst streaming over SSE — Anthropic claude-sonnet-4-6 with OpenRouter fallback, admin-toggled via feature flags; prompt grounded with real 30-day sparklines to prevent hallucinated scores"
---

## The problem

If you hold assets in more than one currency, your portfolio's headline number
lies to you. A position can be up in its own currency and down in yours, or the
reverse, and most retail trackers — Moomoo, StocksCafe, Syfe — collapse both
effects into a single gain figure.

Vantage separates them. A **deterministic FX-vs-asset gain decomposition**
isolates how much of a return came from the asset moving and how much came from
the currency moving, reported against an SGD base.

Built as a production-grade SaaS covering equities, ETFs, crypto, gold, bonds,
real estate, and cash across multiple brokers, leading a 3-person team through
architecture, build, and ship.

## Architecture

A four-layer stack, built for a zero-waterfall initial load:

- **React Server Components** render the first view without a client-side data
  waterfall.
- **Supabase Postgres with Row-Level Security**, enforced at the PostgREST layer
  rather than in application code — so a bug in the app cannot leak another
  user's holdings.
- **Live market data** aggregated from EODHD, CoinGecko, GoldAPI, Finnhub and
  Frankfurter, covering equities, ETFs, crypto, gold, bonds, real estate and
  cash.

## The AI analyst

A dual-provider analyst streams over SSE: Anthropic `claude-sonnet-4-6` with an
OpenRouter fallback, admin-toggled behind feature flags. The prompt is grounded
with real 30-day sparkline data specifically to stop the model inventing
plausible-sounding scores for positions it cannot actually see.
