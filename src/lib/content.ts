export const CATEGORY_ORDER = [
  "official-notices",
  "sonchayapatra-savings",
  "mutual-growth-funds",
  "market-news",
  "explainers",
];

export const CATEGORY_LABELS: Record<string, string> = {
  "official-notices": "Official Notices",
  "sonchayapatra-savings": "Sonchayapatra & Savings",
  "mutual-growth-funds": "Mutual & Growth Funds",
  "market-news": "Market News",
  "explainers": "Explainers",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "official-notices":
    "Official notices and circulars from BSEC, Bangladesh Bank, NSD, and other regulators.",
  "sonchayapatra-savings":
    "News about Sonchayapatra, National Savings Directorate schemes, and savings certificates.",
  "mutual-growth-funds":
    "Updates on mutual funds, growth funds, and unit funds in Bangladesh.",
  "market-news":
    "Capital market news, DSE, CSE, share prices, and IPO updates.",
  "explainers":
    "Simple guides explaining savings, investment, and financial concepts.",
};

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  date: string;
  source: string;
  sourceUrl: string;
  category: string;
  tags: string[];
  excerpt: string;
  featuredImage?: string;
  readingTime?: number;
  lastUpdated?: string;
}

export interface Article extends ArticleFrontmatter {
  body: string;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

export function categoryDescription(category: string): string {
  return CATEGORY_DESCRIPTIONS[category] || "";
}

export function validateArticle(frontmatter: Partial<ArticleFrontmatter>): string[] {
  const errors: string[] = [];
  if (!frontmatter.title) errors.push("title is required");
  if (!frontmatter.slug) errors.push("slug is required");
  if (!frontmatter.date) errors.push("date is required");
  if (!frontmatter.source) errors.push("source is required");
  if (!frontmatter.sourceUrl) errors.push("sourceUrl is required");
  if (!frontmatter.category) errors.push("category is required");
  if (!frontmatter.excerpt) errors.push("excerpt is required");
  return errors;
}
