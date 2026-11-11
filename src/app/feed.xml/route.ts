// @ts-ignore - Next.js 16 route handler compatibility
// @ts-nocheck
import { getLatestArticles } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundpulsebd.com";

export async function GET() {
  const articles = getLatestArticles(50);

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
      <pubDate>${new Date(a.published_date).toUTCString()}</pubDate>
      <description><![CDATA[${a.summary}]]></description>
      <source>${a.source_name}</source>
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