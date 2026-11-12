import { getAllArticles, getAllCategories } from "@/lib/articles";
import { categoryLabel, Article } from "@/lib/content";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const CATEGORY_ORDER = [
  "official-notices",
  "sonchayapatra-savings",
  "mutual-growth-funds",
  "market-news",
  "explainers",
];

export const metadata = {
  title: "FundpulseBD - Savings and fund news for Bangladesh, explained simply.",
  description:
    "Latest news about Sonchayapatra, National Savings Directorate schemes, Bangladesh Bank notices, BSEC notices, mutual funds, and growth funds. Educational content only — not investment advice.",
};

export default function Home() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const featured = articles[0];
  const latest = articles.slice(1, 6);

  const sortedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );

  const categoryHighlights: Article[] = sortedCategories
    .map((cat) => articles.find((a) => a.category === cat))
    .filter((a): a is Article => a !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          FundpulseBD
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
          Savings and fund news for Bangladesh, explained simply.
        </p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Educational content only. Not investment advice. Not affiliated with
          BSEC, Bangladesh Bank, or NSD.
        </p>
      </div>

      {/* Featured article */}
      {featured && (
        <section className="mb-12 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-6 md:p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <Link
                href={`/news/${featured.slug}`}
                className="block"
              >
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{featured.source}</span>
                  <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
                  <time dateTime={featured.date}>
                    {new Date(featured.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full inline-block mb-4">
                {categoryLabel(featured.category)}
              </div>
              <Link
                href={`/news/${featured.slug}`}
                className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Read featured article →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category highlights */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            By category
          </h2>
          <Link
            href="/news"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View all news
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryHighlights.map((article) => (
            <div
              key={article.slug}
              className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-5 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
            >
              <Link
                href={`/news/${article.slug}`}
                className="block"
              >
                <div className="flex items-center gap-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                  {categoryLabel(article.category)}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-2 group-hover:underline line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{article.source}</span>
                  <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Latest articles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Latest articles
          </h2>
          <Link
            href="/news"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View all news
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.length > 0 ? (
            latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">
                No articles found.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-10">
        <NewsletterSignup />
      </div>
    </div>
  );
}
