/**
 * auto-news.ts — Automated news brief generator for FundpulseBD.
 *
 * Pulls fresh headlines from free public Google News RSS queries (which
 * aggregate Bangladeshi publishers such as The Business Standard, The
 * Financial Express, BSS, The Daily Star, and New Age), filters them to the
 * site's topics, deduplicates against previously published items and existing
 * MDX articles, and writes a small number of "news brief" MDX articles to
 * content/articles/.
 *
 * Designed to run unattended from a GitHub Actions schedule. Safe to run
 * repeatedly: a state file records already-processed items.
 *
 * Editorial notes:
 * - Briefs are short, clearly labelled, original summaries built around the
 *   headline facts, never full reproductions of external articles.
 * - Every brief links to the original publisher.
 * - The standard educational disclaimer is appended.
 */

import { writeFileSync, readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, "content", "articles");
const STATE_PATH = join(ROOT, "src", "data", "auto-news-state.json");

const REQUEST_TIMEOUT_MS = 20000;
const USER_AGENT = "FundpulseBD/1.0 (news brief aggregator; contact: editor@fundpulsebd.example.com)";
const ITEM_WINDOW_DAYS = 14; // ignore items older than this
const MAX_PER_RUN = 3; // briefs to create per run
const MAX_ITEMS_PER_QUERY = 15;
const SAME_HOST_DELAY_MS = 2500;
const DUPLICATE_OVERLAP_THRESHOLD = 0.5; // word overlap vs existing article titles

interface Query {
  id: string;
  q: string;
}

const QUERIES: Query[] = [
  { id: "monetary-policy", q: 'Bangladesh Bank monetary policy OR "policy rate" OR repo rate' },
  { id: "bsec", q: "BSEC Bangladesh" },
  { id: "savings", q: 'sanchayapatra OR sonchayapatra OR "savings certificate" Bangladesh' },
  { id: "stock-market", q: '"Dhaka Stock Exchange" OR DSEX OR "Dhaka bourse"' },
  { id: "mutual-funds", q: '"mutual fund" Bangladesh' },
  { id: "deposit-rates", q: 'Bangladesh "deposit rate" OR "fixed deposit" bank' },
];

// Direct publisher feeds: items from these get clean links to the publisher.
const DIRECT_FEEDS: Array<{ id: string; name: string; url: string }> = [
  { id: "daily-star-business", name: "The Daily Star", url: "https://www.thedailystar.net/business/rss.xml" },
];

interface CategoryRule {
  category: string;
  keywords: string[];
  weight?: number;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "sonchayapatra-savings",
    keywords: ["sanchayapatra", "sonchayapatra", "savings certificate", "national savings", "post office savings", "nsd"],
  },
  {
    category: "mutual-growth-funds",
    keywords: ["mutual fund", "asset management", "nav", "unitholder", "open-end", "closed-end", "fund manager", "amc"],
  },
  {
    category: "official-notices",
    keywords: ["bsec", "bangladesh bank", "circular", "gazette", "directive", "regulator", "regulation", "guideline", "notice"],
    weight: 2,
  },
  {
    category: "explainers",
    keywords: ["fixed deposit", "deposit rate", "fdr", "interest rate", "inflation", "explained"],
  },
  {
    category: "market-news",
    keywords: ["dse", "dsex", "cse", "share", "stock", "turnover", "broker", "ipo", "trading", "index", "bourse", "caspi"],
  },
];

// Bangladesh-relevance keywords: at least one must appear in title or source
const BD_KEYWORDS = [
  "bangladesh",
  "bangladeshi",
  "dhaka",
  "taka",
  "bsec",
  "dse",
  "dsex",
  "sanchayapatra",
  "sonchayapatra",
];

const CATEGORY_TAGS: Record<string, string[]> = {
  "official-notices": ["BSEC", "regulation"],
  "sonchayapatra-savings": ["Sanchayapatra", "savings"],
  "mutual-growth-funds": ["mutual fund", "investment"],
  "market-news": ["DSE", "stock market"],
  explainers: ["explainer", "banking"],
};

const CATEGORY_CONTEXT: Record<string, string[]> = {
  "official-notices": [
    "Regulatory changes like this shape how companies, brokerages, banks, and investors operate in Bangladesh's financial markets. The full effect usually becomes clear only after implementing rules and follow-up notices are issued.",
    "If the decision affects something you hold — such as shares, a margin account, or a fund investment — check the original notice for exact conditions, deadlines, and who is covered. Specifics matter more than headlines.",
  ],
  "sonchayapatra-savings": [
    "National savings schemes remain popular with Bangladeshi savers because they are government-backed and offer rates that often exceed bank fixed deposits. Rates, purchase limits, source tax, and eligibility rules are set by the government and reviewed roughly every six months, so always confirm the current terms at an NSD office or designated bank branch before buying or encashing.",
  ],
  "mutual-growth-funds": [
    "Mutual fund units are not bank deposits — their value can fall as well as rise. Fund performance varies widely between managers, and fees reduce returns. Review a fund's prospectus, NAV history, portfolio composition, and charges before investing.",
  ],
  "market-news": [
    "Daily index and turnover movements are noisy: a strong or weak session is not a trend. Turnover levels, market breadth, and corporate earnings give a fuller picture than the index alone.",
    "Share prices can fall as quickly as they rise, and past performance does not predict future returns. Match any decision to your own goals, liquidity needs, and risk tolerance.",
  ],
  explainers: [
    "When interest rates or prices change, the effect on savers depends on the fine print: how often interest compounds, what source tax is deducted, and whether the rate is fixed or floating. Comparing the effective after-tax yield across instruments is more useful than looking at headline rates.",
  ],
};

interface RssItem {
  title: string; // headline with publisher suffix stripped
  publisher: string;
  link: string;
  description: string;
  pubDate: Date;
  guid: string;
}

interface StateFile {
  seen: Record<string, string>; // guid -> ISO first-seen timestamp
  generated_at: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, " ");
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanHeadline(raw: string): { title: string; publisher: string } {
  let title = decodeEntities(stripHtml(raw)).trim();
  // Google News format: "Headline - Publisher"
  let publisher = "";
  const match = title.match(/^(.*)\s+-\s+([^-]{2,60})$/);
  if (match) {
    title = match[1].trim();
    publisher = match[2].trim();
  }
  title = title.replace(/\s+/g, " ");
  return { title, publisher };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function normalizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s\u0980-\u09ff]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function wordOverlap(wordsA: string[], wordsB: string[]): number {
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  const setB = new Set(wordsB);
  let shared = 0;
  for (const w of new Set(wordsA)) if (setB.has(w)) shared += 1;
  return shared / Math.min(new Set(wordsA).size, new Set(wordsB).size);
}

function assignCategory(text: string): string {
  const lower = text.toLowerCase();
  let best = "market-news";
  let bestScore = 0;
  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) score += rule.weight ?? 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = rule.category;
    }
  }
  return best;
}

function loadState(): StateFile {
  if (existsSync(STATE_PATH)) {
    try {
      return JSON.parse(readFileSync(STATE_PATH, "utf-8")) as StateFile;
    } catch {
      /* fall through */
    }
  }
  return { seen: {}, generated_at: "" };
}

function loadExistingTitles(): { slugs: Set<string>; titleWords: string[][] } {
  const slugs = new Set<string>();
  const titleWords: string[][] = [];
  if (existsSync(ARTICLES_DIR)) {
    for (const file of readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"))) {
      const raw = readFileSync(join(ARTICLES_DIR, file), "utf-8");
      const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatterMatch) continue;
      const slug = (raw.match(/^slug:\s*"?(.+?)"?\s*$/m) || [])[1];
      const title = (raw.match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1];
      if (slug) slugs.add(slug.trim());
      if (title) titleWords.push(normalizeTitle(decodeEntities(title.trim())));
    }
  }
  return { slugs, titleWords };
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseRssItems(xml: string, fallbackPublisher = ""): RssItem[] {
  const items: RssItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of itemBlocks) {
    const rawTitle = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
    const desc = (block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || "";
    const pubDateStr = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || "";
    const guid = (block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/) || block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
    const publisherTag = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || "";
    const { title, publisher } = cleanHeadline(rawTitle);
    if (!title || !link) continue;
    let pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
    // Some feeds use 2-digit years (e.g. "Fri, 13 Nov 26 ..."); normalise to 20xx
    if (!isNaN(pubDate.getTime()) && pubDate.getFullYear() < 100) {
      pubDate = new Date(pubDate.setFullYear(pubDate.getFullYear() + 2000));
    }
    if (isNaN(pubDate.getTime())) continue;
    items.push({
      title,
      publisher: publisher || decodeEntities(publisherTag).trim() || fallbackPublisher,
      link: decodeEntities(link).trim(),
      description: stripHtml(decodeEntities(desc)),
      pubDate,
      guid: decodeEntities(guid).trim() || link,
    });
  }
  return items;
}

function isBangladeshRelevant(item: RssItem): boolean {
  // Check the headline only — publisher names such as "Bangladesh Sangbad
  // Sangstha" also appear on syndicated international stories.
  const haystack = item.title.toLowerCase();
  return BD_KEYWORDS.some((kw) => haystack.includes(kw));
}

function isTopicRelevant(item: RssItem): boolean {
  const lower = item.title.toLowerCase();
  return CATEGORY_RULES.some((rule) => rule.keywords.some((kw) => lower.includes(kw)));
}

function headlineSentence(title: string): string {
  const trimmed = title.replace(/[.\s]+$/, "");
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

function buildBrief(item: RssItem, category: string): string {
  const dateStr = item.pubDate.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const context = (CATEGORY_CONTEXT[category] || CATEGORY_CONTEXT["market-news"]).join("\n\n");
  return [
    `> **News brief:** This is a short, automatically compiled summary based on a recent report by ${item.publisher}. Read the full report at the source link below for complete details.`,
    "",
    `${item.publisher} reported on ${dateStr} that ${headlineSentence(item.title)}`,
    "",
    context,
    "",
    `**Read the full report:** [${item.publisher}](${item.link})`,
    "",
    "> **Disclaimer:** FundpulseBD is an educational news portal. This content is for general information only and does not constitute investment advice. We are not affiliated with BSEC, Bangladesh Bank, or the National Savings Directorate. Always consult a qualified financial advisor before making investment decisions.",
    "",
  ].join("\n");
}

function buildFrontmatter(item: RssItem, slug: string, category: string): string {
  const tags = Array.from(new Set([...(CATEGORY_TAGS[category] || []), "news brief"]));
  const excerpt = `${item.publisher} reports: ${item.title}`.slice(0, 197) + (item.title.length > 180 ? "…" : "");
  const lines = [
    "---",
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `date: ${item.pubDate.toISOString().slice(0, 10)}`,
    `source: "${item.publisher.replace(/"/g, '\\"')}"`,
    `sourceUrl: "${item.link.replace(/"/g, "")}"`,
    `category: "${category}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `featuredImage: null`,
    `lastUpdated: ${new Date().toISOString().slice(0, 10)}`,
    "---",
    "",
  ];
  return lines.join("\n");
}

async function main(): Promise<void> {
  console.log("FundpulseBD auto-news starting...");
  const state = loadState();
  const existing = loadExistingTitles();
  const cutoff = Date.now() - ITEM_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const candidates: RssItem[] = [];
  const runNormalized = new Set<string>();

  for (const query of QUERIES) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query.q + " when:30d")}&hl=en-US&gl=BD&ceid=BD:en`;
    try {
      const xml = await fetchText(url);
      const items = parseRssItems(xml).slice(0, MAX_ITEMS_PER_QUERY);
      console.log(`Query "${query.id}": ${items.length} item(s)`);
      for (const item of items) {
        if (candidates.some((c) => c.guid === item.guid)) continue;
        candidates.push(item);
      }
    } catch (err) {
      console.error(`Query "${query.id}" failed: ${(err as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, SAME_HOST_DELAY_MS));
  }

  for (const feed of DIRECT_FEEDS) {
    try {
      const xml = await fetchText(feed.url);
      const items = parseRssItems(xml, feed.name).slice(0, MAX_ITEMS_PER_QUERY);
      console.log(`Feed "${feed.id}": ${items.length} item(s)`);
      for (const item of items) {
        if (candidates.some((c) => c.guid === item.guid)) continue;
        candidates.push(item);
      }
    } catch (err) {
      console.error(`Feed "${feed.id}" failed: ${(err as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, SAME_HOST_DELAY_MS));
  }

  console.log(`Total candidate items: ${candidates.length}`);

  const fresh: RssItem[] = candidates
    .filter((item) => item.pubDate.getTime() >= cutoff)
    .filter(isBangladeshRelevant)
    .filter(isTopicRelevant)
    .filter((item) => !state.seen[item.guid]);

  console.log(`Fresh, relevant, unseen items: ${fresh.length}`);

  const created: string[] = [];
  for (const item of fresh) {
    if (created.length >= MAX_PER_RUN) break;

    const normalized = normalizeTitle(item.title);
    if (runNormalized.has(normalized.join(" "))) continue;
    if (existing.titleWords.some((words) => wordOverlap(normalized, words) >= DUPLICATE_OVERLAP_THRESHOLD)) {
      continue; // too similar to an already-published article
    }

    const category = assignCategory(`${item.title} ${item.description}`);
    let slug = slugify(item.title);
    if (!slug) slug = `news-brief-${item.pubDate.toISOString().slice(0, 10)}`;
    if (existing.slugs.has(slug)) slug = `${slug}-${item.pubDate.toISOString().slice(0, 10).replace(/-/g, "")}`;
    let finalSlug = slug;
    let n = 2;
    while (existing.slugs.has(finalSlug)) {
      finalSlug = `${slug}-${n}`;
      n += 1;
    }

    const mdx = buildFrontmatter(item, finalSlug, category) + "\n" + buildBrief(item, category);
    writeFileSync(join(ARTICLES_DIR, `${finalSlug}.mdx`), mdx, "utf-8");
    existing.slugs.add(finalSlug);
    existing.titleWords.push(normalized);
    runNormalized.add(normalized.join(" "));
    state.seen[item.guid] = new Date().toISOString();
    created.push(finalSlug);
    console.log(`Created brief: ${finalSlug} (${category}) — from ${item.publisher}`);
  }

  // Trim state file to the most recent 3000 entries
  const seenEntries = Object.entries(state.seen).sort((a, b) => (a[1] < b[1] ? 1 : -1));
  state.seen = Object.fromEntries(seenEntries.slice(0, 3000));
  state.generated_at = new Date().toISOString();
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");

  console.log(`Auto-news complete. Created ${created.length} brief(s).`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
