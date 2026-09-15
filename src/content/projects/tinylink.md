---
name: TinyLink
tagline: URL shortener with custom short links and per-link click analytics.
start: "2025"
context: Personal Project
repo: darthrevan030/url-shortener
order: 6
showcase: true
links:
  - label: GitHub
    url: https://github.com/darthrevan030/url-shortener
tech:
  - Next.js 16
  - TypeScript
  - MongoDB Atlas
  - Mongoose
  - Tailwind CSS
  - Vercel
resumeBullets:
  - "Built a full-stack URL shortener with custom short link creation, auto-generated codes via nanoid, and per-link click tracking with analytics"
  - "Implemented RESTful API endpoints for URL creation and redirect handling, with MongoDB Atlas for persistent storage and Mongoose ODM for schema validation"
  - "Deployed to production on Vercel with environment-based configuration for development and production base URLs"
---

## What it does

A full-stack URL shortener: pick your own short link, or let nanoid
auto-generate one. Every link tracks its own click count, so the analytics
are per-link rather than site-wide.

## Stack

RESTful API endpoints handle creation and redirect resolution, backed by
**MongoDB Atlas** for persistent storage and **Mongoose** as the ODM enforcing
schema validation on the way in.

## Deployment

Deployed to production on Vercel, with environment-based configuration
switching the base URL between development and production so short links
resolve correctly in both.
