// @ts-ignore - Next.js 16 route handler compatibility
// @ts-nocheck
import { getAllArticles } from "@/lib/articles";

import { getSiteUrl } from "@/lib/utils";

const SITE_URL = getSiteUrl();

export async function GET() {
  const articles = getAllArticles().slice(0, 50);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FundpulseBD</title>
    <link>${SITE_URL}</link>
    <description>Savings and fund news for Bangladesh, explained simply.</description>
    <language>en-BD</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${articles
      .map(
      (a) => `<item>
      <title><![CDATA[${a.title}]]></title>
      <link>${SITE_URL}/news/${a.slug}</link>
      <guid isPermaLink="false">${SITE_URL}/news/${a.slug}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description><![CDATA[${a.excerpt}]]></description>
      <source>${a.source}</source>
    </item>`
    )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=86400",
    },
  });
}
