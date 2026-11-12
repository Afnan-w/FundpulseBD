import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { CATEGORY_ORDER } from "./content";
import type { Article, ArticleFrontmatter } from "./content";

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, "content", "articles");

function listArticleFiles(): string[] {
  if (!existsSync(ARTICLES_DIR)) return [];
  return readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
}

function readArticleFile(fileName: string): Article | null {
  try {
    const fullPath = join(ARTICLES_DIR, fileName);
    const raw = readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const frontmatter = data as Partial<ArticleFrontmatter>;
    if (!frontmatter.title || !frontmatter.slug || !frontmatter.date) {
      return null;
    }

    const words = content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/[#*`_~\[\]()!]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = words ? words.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      title: frontmatter.title,
      slug: frontmatter.slug,
      date: frontmatter.date,
      source: frontmatter.source || "FundpulseBD Editorial",
      sourceUrl: frontmatter.sourceUrl || "",
      category: frontmatter.category || "market-news",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      excerpt: frontmatter.excerpt || "",
      featuredImage: frontmatter.featuredImage,
      readingTime: frontmatter.readingTime || readingTime,
      lastUpdated: frontmatter.lastUpdated,
      body: content,
    };
  } catch {
    return null;
  }
}

export function getAllArticles(): Article[] {
  return listArticleFiles()
    .map(readArticleFile)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(getAllArticles().map((a) => a.category));
  return CATEGORY_ORDER.filter((cat) => categories.has(cat));
}

export function getRelatedArticles(
  slug: string,
  category: string,
  limit: number = 3,
): Article[] {
  return getArticlesByCategory(category)
    .filter((a) => a.slug !== slug)
    .slice(0, limit);
}

export function getLatestArticles(limit: number = 20): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
