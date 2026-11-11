import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "data");
const SOURCES_PATH = join(DATA_DIR, "sources.json");
const ARTICLES_PATH = join(DATA_DIR, "articles.json");
const CATEGORY_RULES_PATH = join(DATA_DIR, "category-rules.json");

const MAX_ARTICLES = 500;
const REQUEST_DELAY_MS = 2000;
const USER_AGENT = "FundpulseBD/1.0 (news aggregator; contact: editor@fundpulsebd.example.com)";

interface Source {
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

interface ArticlesFile {
  articles: Article[];
  generated_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
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
  if (clean.length <= 300) return clean;
  return clean.substring(0, 300).trimEnd() + "\u2026";
}

function parseRSS(xml: string): any[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items: any[] = [];
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

async function fetchRSS(source: Source): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    const response = await fetch(source.url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!response.ok) {
      console.warn(`RSS fetch failed for ${source.name}: ${response.status}`);
      return articles;
    }
    const xml = await response.text();
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
    console.error(`Error fetching RSS from ${source.name}:`, err);
  }
  return articles;
}

async function fetchHTML(source: Source): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    const response = await fetch(source.url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!response.ok) {
      console.warn(`HTML fetch failed for ${source.name}: ${response.status}`);
      return articles;
    }
    const html = await response.text();
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
    console.error(`Error fetching HTML from ${source.name}:`, err);
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
  if (!existsSync(ARTICLES_PATH)) return [];
  const raw = readFileSync(ARTICLES_PATH, "utf-8");
  const data: ArticlesFile = JSON.parse(raw);
  return data.articles;
}

function saveArticles(articles: Article[]): void {
  articles.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
  const trimmed = articles.slice(0, MAX_ARTICLES);

  const output: ArticlesFile = {
    articles: trimmed,
    generated_at: new Date().toISOString(),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(ARTICLES_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Saved ${trimmed.length} articles to ${ARTICLES_PATH}`);
}

async function main(): Promise<void> {
  console.log("FundpulseBD fetch-news starting...");
  const sources = loadSources();
  const enabledSources = sources.filter((s) => s.enabled);

  if (enabledSources.length === 0) {
    console.log("No enabled sources found. Edit data/sources.json to enable sources.");
    return;
  }

  const existing = loadExistingArticles();
  let newCount = 0;

  for (const source of enabledSources) {
    console.log(`Fetching from ${source.name} (${source.type})...`);
    let fetched: Article[] = [];

    if (source.type === "rss") {
      fetched = await fetchRSS(source);
    } else if (source.type === "html") {
      fetched = await fetchHTML(source);
    }

    for (const article of fetched) {
      if (!isDuplicate(existing, article)) {
        existing.push(article);
        newCount++;
      }
    }

    await sleep(REQUEST_DELAY_MS);
  }

  saveArticles(existing);
  console.log(`Fetch complete. Added ${newCount} new articles. Total: ${existing.length}.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

