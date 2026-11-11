import { getLatestArticles, getAllCategories, categoryLabel } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";

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
  const articles = getLatestArticles(20);
  const categories = getAllCategories();

  const sortedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          FundpulseBD
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Savings and fund news for Bangladesh, explained simply.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Educational content only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {sortedCategories.map((cat) => (
          <a
            key={cat}
            href={`/category/${cat}`}
            className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {categoryLabel(cat)}
          </a>
        ))}
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
