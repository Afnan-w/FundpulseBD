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
- Content stored as JSON files in /data (no database)
- Node.js fetch script at /scripts/fetch-news.ts
- GitHub Actions for automated fetching every 2 hours
- Deploy-ready for Vercel

## Getting Started

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
