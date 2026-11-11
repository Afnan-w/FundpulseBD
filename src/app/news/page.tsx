import articlesData from "@/data/articles.json";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

type Article = {
  title: string;
  source_name: string;
  source_url: string;
  published_date: string;
  category: string;
  summary: string;
  slug: string;
};

const CATEGORY_ORDER = [
  "official-notices",
  "sonchayapatra-savings",
  "mutual-growth-funds",
  "market-news",
  "explainers",
];

const CATEGORY_LABELS: Record<string, string> = {
  "official-notices": "Official Notices",
  "sonchayapatra-savings": "Sonchayapatra & Savings",
  "mutual-growth-funds": "Mutual & Growth Funds",
  "market-news": "Market News",
  "explainers": "Explainers",
};

export const dynamic = "force-dynamic";

const articles: Article[] = articlesData.articles;
const categories = [...new Set(articles.map((a) => a.category))].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
);

export const metadata = {
  title: "News",
  description:
    "All savings and fund news for Bangladesh: Sonchayapatra, National Savings Directorate schemes, Bangladesh Bank and BSEC notices, mutual funds, and market news. Educational content only — not investment advice.",
};

interface NewsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category, q } = await searchParams;
  const all = articles;

  let filtered = all;

  if (category && categories.includes(category)) {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (q && q.trim()) {
    const query = normalize(q);
    filtered = filtered.filter(
      (a) =>
        normalize(a.title).includes(query) ||
        normalize(a.summary).includes(query) ||
        normalize(a.source_name).includes(query)
    );
  }

  const activeCategory = category && categories.includes(category) ? category : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">News</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Savings and fund news for Bangladesh, explained simply.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/news${q ? `?q=${encodeURIComponent(q)}` : ""}`}
          className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
            !activeCategory
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
              : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/news?category=${cat}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
              activeCategory === cat
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </Link>
        ))}
      </div>

      <form action="/news" method="get" className="relative mb-8">
        {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute left-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {(activeCategory || (q && q.trim())) && (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {activeCategory ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""}
          {q && q.trim() ? ` matching “${q.trim()}”` : ""}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
            <Link href="/news" className="mt-2 inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Clear filters
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/news"
          className="inline-block px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
        >
          View all news
        </Link>
      </div>
    </div>
  );
}
