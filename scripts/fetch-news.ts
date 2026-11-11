import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src/data");
const SOURCES_PATH = join(DATA_DIR, "news-sources.json");
const CATEGORY_RULES_PATH = join(DATA_DIR, "category-rules.json");
const NEWS_PATH = join(DATA_DIR, "news.json");
const ARTICLES_PATH = join(DATA_DIR, "articles.json");

const MAX_ARTICLES = 500;
const REQUEST_TIMEOUT_MS = 15000;
const SAME_HOST_DELAY_MS = 3000;
const USER_AGENT = "FundpulseBD/1.0 (news aggregator; contact: editor@fundpulsebd.example.com)";
const SUMMARY_MAX = 300;

interface Source {
  id: string;
  name: string;
  type: "rss" | "html";
  url: string;
  category: string;
  enabled: boolean;
}

interface CategoryRule {
  category: string;
  keywords: string[];
  bangla_keywords: string[];
}

interface Article {
  title: string;
  source_name: string;
  source_url: string;
  published_date: string;
  category: string;
  summary: string;
  slug: string;
}

interface SourcesFile {
  sources: Source[];
  generated_at: string;
}

interface CategoryRulesFile {
  rules: CategoryRule[];
}

interface NewsFile {
  articles: Article[];
  generated_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isDuplicate(existing: Article[], candidate: Article): boolean {
  if (existing.some((a) => a.source_url === candidate.source_url)) return true;
  const norm = normalizeTitle(candidate.title);
  if (existing.some((a) => normalizeTitle(a.title) === norm)) return true;
  return false;
}

function assignCategory(title: string, rules: CategoryRule[]): string {
  const text = (title + " ").toLowerCase();
  let bestMatch = "";
  let bestScore = 0;

  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    for (const kw of rule.bangla_keywords) {
      if (text.includes(kw.toLowerCase())) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.category;
    }
  }

  return bestMatch || "market-news";
}

function extractSummary(htmlOrText: string): string {
  const $ = cheerio.load(htmlOrText);
  const text = $("body").text() || $("p").first().text() || $.text();
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= SUMMARY_MAX) return clean;
  return clean.substring(0, SUMMARY_MAX).trimEnd() + "\u2026";
}

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  isoDate: string;
}

function parseRSS(xml: string): RssItem[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items: RssItem[] = [];
  $("item").each((_, el) => {
    const $el = $(el);
    items.push({
      title: $el.find("title").text() || "",
      link: $el.find("link").text() || "",
      description: $el.find("description").text() || "",
      pubDate: $el.find("pubDate").text() || "",
      isoDate: $el.find("pubDate").text() || "",
    });
  });
  return items;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function fetchRobotsAllowed(sourceUrl: string): Promise<boolean> {
  try {
    const url = new URL(sourceUrl);
    const robotsUrl = `${url.origin}/robots.txt`;
    const res = await withTimeout(fetch(robotsUrl, { headers: { "User-Agent": USER_AGENT } }), REQUEST_TIMEOUT_MS);
    if (!res.ok) return true;
    const text = await res.text();
    const path = url.pathname || "/";
    const lines = text.split(/\r?\n/);
    let currentAgentApplies = false;
    let disallowed = false;
    for (const line of lines) {
      const trimmed = line.trim().split("#")[0].trim();
      if (!trimmed) continue;
      const [key, ...rest] = trimmed.split(":");
      const value = rest.join(":").trim();
      if (key.toLowerCase() === "user-agent") {
        currentAgentApplies = value === "*" || value.toLowerCase().includes("fundpulsebd");
        disallowed = false;
      } else if (key.toLowerCase() === "disallow" && currentAgentApplies) {
        if (value === "" ) disallowed = false;
        else if (path.startsWith(value)) disallowed = true;
      } else if (key.toLowerCase() === "allow" && currentAgentApplies) {
        if (value && path.startsWith(value)) disallowed = false;
      }
    }
    return !disallowed;
  } catch {
    return true;
  }
}

const lastFetchByHost = new Map<string, number>();

async function waitForSameHost(sourceUrl: string): Promise<void> {
  try {
    const host = new URL(sourceUrl).host;
    const now = Date.now();
    const last = lastFetchByHost.get(host) ?? 0;
    const elapsed = now - last;
    if (elapsed < SAME_HOST_DELAY_MS) {
      await sleep(SAME_HOST_DELAY_MS - elapsed);
    }
    lastFetchByHost.set(host, Date.now());
  } catch {
    await sleep(SAME_HOST_DELAY_MS);
  }
}

async function fetchWithRetry(sourceUrl: string): Promise<string> {
  const res = await withTimeout(fetch(sourceUrl, { headers: { "User-Agent": USER_AGENT } }), REQUEST_TIMEOUT_MS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchRSS(source: Source): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    if (!(await fetchRobotsAllowed(source.url))) {
      console.warn(`robots.txt disallows ${source.name} (${source.url}); skipping`);
      return articles;
    }
    await waitForSameHost(source.url);
    const xml = await fetchWithRetry(source.url);
    const items = parseRSS(xml).slice(0, 20);

    for (const item of items) {
      const title = item.title || "Untitled";
      const summary = extractSummary(item.description || "");
      const published = item.pubDate || item.isoDate || new Date().toISOString();
      const category = assignCategory(title, loadCategoryRules());

      articles.push({
        title,
        source_name: source.name,
        source_url: item.link || source.url,
        published_date: new Date(published).toISOString(),
        category,
        summary,
        slug: slugify(title),
      });
    }
  } catch (err) {
    console.error(`Error fetching RSS from ${source.name}:`, (err as Error).message);
  }
  return articles;
}

async function fetchHTML(source: Source): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    if (!(await fetchRobotsAllowed(source.url))) {
      console.warn(`robots.txt disallows ${source.name} (${source.url}); skipping`);
      return articles;
    }
    await waitForSameHost(source.url);
    const html = await fetchWithRetry(source.url);
    const $ = cheerio.load(html);

    const selectors = ["article", ".article", ".news-item", ".post", "h2 a", "h3 a"];
    let found = false;

    for (const sel of selectors) {
      const els = $(sel);
      if (els.length > 0) {
        found = true;
        els.each((_, el) => {
          const $el = $(el);
          const title = $el.text().trim() || $el.attr("title") || "";
          const link = $el.attr("href") || "";
          if (!title || !link) return;
          const absoluteUrl = link.startsWith("http")
            ? link
            : new URL(link, source.url).href;
          const summary = extractSummary($el.parent().html() || "");
          const category = assignCategory(title, loadCategoryRules());

          articles.push({
            title,
            source_name: source.name,
            source_url: absoluteUrl,
            published_date: new Date().toISOString(),
            category,
            summary,
            slug: slugify(title),
          });
        });
        break;
      }
    }

    if (!found) {
      console.warn(`No article elements found for HTML source ${source.name}`);
    }
  } catch (err) {
    console.error(`Error fetching HTML from ${source.name}:`, (err as Error).message);
  }
  return articles;
}

function loadSources(): Source[] {
  if (!existsSync(SOURCES_PATH)) return [];
  const raw = readFileSync(SOURCES_PATH, "utf-8");
  const data: SourcesFile = JSON.parse(raw);
  return data.sources;
}

function loadCategoryRules(): CategoryRule[] {
  if (!existsSync(CATEGORY_RULES_PATH)) return [];
  const raw = readFileSync(CATEGORY_RULES_PATH, "utf-8");
  const data: CategoryRulesFile = JSON.parse(raw);
  return data.rules;
}

function loadExistingArticles(): Article[] {
  if (!existsSync(NEWS_PATH)) return [];
  try {
    const raw = readFileSync(NEWS_PATH, "utf-8");
    const data: NewsFile = JSON.parse(raw);
    return data.articles;
  } catch {
    return [];
  }
}

function saveNews(articles: Article[]): void {
  articles.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
  const trimmed = articles.slice(0, MAX_ARTICLES);

  const output: NewsFile = {
    articles: trimmed,
    generated_at: new Date().toISOString(),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(NEWS_PATH, JSON.stringify(output, null, 2), "utf-8");
  writeFileSync(ARTICLES_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Saved ${trimmed.length} articles to ${NEWS_PATH} and ${ARTICLES_PATH}`);
}

async function main(): Promise<void> {
  console.log("FundpulseBD fetch-news starting...");
  const sources = loadSources();
  const enabledSources = sources.filter((s) => s.enabled);

  if (enabledSources.length === 0) {
    console.log("No enabled sources found. Edit src/data/news-sources.json to enable sources.");
    return;
  }

  const existing = loadExistingArticles();
  let newCount = 0;

  for (const source of enabledSources) {
    console.log(`Fetching from ${source.name} (${source.type})...`);
    let fetched: Article[] = [];

    try {
      if (source.type === "rss") {
        fetched = await fetchRSS(source);
      } else if (source.type === "html") {
        fetched = await fetchHTML(source);
      }
    } catch (err) {
      console.error(`Source ${source.name} failed completely:`, (err as Error).message);
      continue;
    }

    for (const article of fetched) {
      if (!isDuplicate(existing, article)) {
        existing.push(article);
        newCount++;
      }
    }
  }

  saveNews(existing);
  console.log(`Fetch complete. Added ${newCount} new articles. Total: ${existing.length}.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
