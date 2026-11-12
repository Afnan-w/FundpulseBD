# FundpulseBD

Savings and fund news for Bangladesh, explained simply.

## Overview

FundpulseBD is a Bangladeshi savings and investment education news portal. It automatically collects official and public news about:

- Sonchayapatra & National Savings Directorate (NSD) schemes
- Bangladesh Bank notices
- BSEC (securities regulator) notices
- Mutual funds and growth funds
- Market news and explainers

## Tech Stack

- Next.js 16 (App Router) with TypeScript and Tailwind CSS
- File-based content: Markdown/MDX articles in `/content/articles/` (no database)
- RSS feed at `/feed.xml`, sitemap at `/sitemap.xml`
- Deploy-ready for Vercel

## Content: How to publish a new article

FundpulseBD uses a file-based content system. To publish a new article, just add one `.mdx` file and rebuild — no CMS, no database, no login.

### 1. Create the article file

Create a new file at `content/articles/<slug>.mdx` with YAML frontmatter followed by the article body (Markdown/MDX):

```mdx
---
title: BSEC Issues New Circular on Mutual Fund Disclosure
slug: bsec-new-circular-mutual-fund-disclosure-2025
date: 2025-11-15
source: Bangladesh Securities and Exchange Commission (BSEC)
sourceUrl: https://www.bsec.gov.bd/
category: official-notices
tags: ["BSEC", "mutual fund", "disclosure"]
excerpt: BSEC has issued a new circular requiring enhanced disclosure from mutual funds.
featuredImage: null
readingTime: 4
lastUpdated: 2025-11-15
---

Your article summary goes here. Write in short, clear, neutral paragraphs. End with the standard disclaimer (see below).

> **Disclaimer:** FundpulseBD is an educational news portal. This content is for general information only and does not constitute investment advice. We are not affiliated with BSEC, Bangladesh Bank, or the National Savings Directorate. Always consult a qualified financial advisor before making investment decisions.
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Article headline |
| `slug` | Yes | URL-friendly identifier (e.g. `bsec-new-circular-2025`). Must be unique. |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `source` | Yes | Original publisher name |
| `sourceUrl` | Yes | Link to the original source |
| `category` | Yes | One of: `official-notices`, `sonchayapatra-savings`, `mutual-growth-funds`, `market-news`, `explainers` |
| `tags` | Yes | Array of topic tags |
| `excerpt` | Yes | Short summary used in listings and meta descriptions |
| `featuredImage` | No | Optional image URL; falls back to the generated OG image |
| `readingTime` | No | Auto-computed from body length if omitted |
| `lastUpdated` | No | Date the article was last revised |

### 2. Editorial rules

- Write original summaries only — never reproduce full external article text.
- Always link to the original source via `sourceUrl`.
- Keep the tone educational, neutral, and Bangladesh-focused.
- Always end the article with the educational / not-investment-advice disclaimer.
- Do not give buy/sell recommendations or name specific securities as picks.

### 3. Build and deploy

```bash
npm run build    # static pages, RSS, and sitemap are generated automatically
npm start        # production server
# or push to GitHub — Vercel deploys on push
```

### 4. Validate an article

A small validation script lists all articles and reports missing frontmatter fields:

```bash
npx tsx scripts/validate-content.ts
```

## Adding a News Source

The legacy fetch scripts under `/scripts` are kept for reference. New content is now added by creating MDX files directly rather than by automated fetching.

## Deployment (Vercel)

...

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

npm install

### Development

npm run dev

Open http://localhost:3000 in your browser.

### Building

npm run build
npm start

### Running Tests

npm test

### Fetching News

npm run fetch-news

Note: All sources in data/sources.json are marked enabled: false by default. You must enable them after confirming each source's terms of service allow fetching.

## Adding a News Source

1. Edit data/sources.json
2. Add a new source entry.

3. Set enabled: true only after confirming the source permits automated fetching.
4. Run npm run fetch-news to collect articles.

## Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Configure environment variables (optional):
   - NEXT_PUBLIC_SITE_URL - your production URL
   - NEXT_PUBLIC_GA_ID - Google Analytics 4 measurement ID (optional)
4. Deploy.

## Compliance & Safety

- No investment recommendations anywhere in the UI or generated text.
- Disclaimer shown on every article page and in the footer.
- No BSEC, Bangladesh Bank, or NSD logos used as site branding.

## SEO Features

- Unique title and meta description per page
- Canonical URLs on every page
- Open Graph and Twitter Card meta tags
- Automatic sitemap.xml and robots.txt
- RSS feed at /feed.xml

## Sharing Features

- Facebook, X (Twitter), WhatsApp, Telegram, LinkedIn, Email share buttons
- Copy link button with success feedback
- Native Web Share API on mobile

## License

Private - all rights reserved.

## Support

Email: editor@fundpulsebd.example.com
