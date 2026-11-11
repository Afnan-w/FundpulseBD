import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src/data");
const ARTICLES_PATH = join(DATA_DIR, "articles.json");

export interface Article {
  title: string;
  source_name: string;
  source_url: string;
  published_date: string;
  category: string;
  summary: string;
  slug: string;
}

export interface ArticlesFile {
  articles: Article[];
  generated_at: string;
}

export function getAllArticles(): Article[] {
  if (!existsSync(ARTICLES_PATH)) return [];
  try {
    const raw = readFileSync(ARTICLES_PATH, "utf-8");
    const data: ArticlesFile = JSON.parse(raw);
    return data.articles;
  } catch {
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((a) => a.category === category);
}

export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = new Set(articles.map((a) => a.category));
  return Array.from(categories).sort();
}

export function getRelatedArticles(slug: string, category: string, limit: number = 3): Article[] {
  const articles = getArticlesByCategory(category);
  return articles.filter((a) => a.slug !== slug).slice(0, limit);
}

export function getLatestArticles(limit: number = 20): Article[] {
  const articles = getAllArticles();
  return articles.slice(0, limit);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "official-notices": "Official Notices",
    "sonchayapatra-savings": "Sonchayapatra & Savings",
    "mutual-growth-funds": "Mutual & Growth Funds",
    "market-news": "Market News",
    "explainers": "Explainers",
  };
  return labels[category] || category;
}

export function categoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "official-notices": "Official notices and circulars from BSEC, Bangladesh Bank, NSD, and other regulators.",
    "sonchayapatra-savings": "News about Sonchayapatra, National Savings Directorate schemes, and savings certificates.",
    "mutual-growth-funds": "Updates on mutual funds, growth funds, and unit funds in Bangladesh.",
    "market-news": "Capital market news, DSE, CSE, share prices, and IPO updates.",
    "explainers": "Simple guides explaining savings, investment, and financial concepts.",
  };
  return descriptions[category] || "";
}

