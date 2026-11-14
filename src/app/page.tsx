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

function formatDateStr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const featured = articles[0];
  const latest = articles.slice(1, 7);

  const sortedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );

  const categoryHighlights: Article[] = sortedCategories
    .map((cat) => articles.find((a) => a.category === cat))
    .filter((a): a is Article => a !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="label-mono text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          BD finance · daily briefing
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 max-w-3xl leading-[1.1]">
          Savings &amp; fund news for Bangladesh, explained simply.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl">
          Sonchayapatra rates, BSEC and Bangladesh Bank notices, mutual funds
          and market moves — tracked and summarised for you.
        </p>
        <p className="label-mono text-gray-400 dark:text-gray-500 mt-4">
          Educational only · Not investment advice
        </p>
      </div>

      {/* Featured article — dark "top story" panel */}
      {featured && (
        <section className="mb-12">
          <div className="rounded-2xl bg-gray-950 dark:bg-black border border-gray-800 text-white p-6 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-emerald-500 via-emerald-400/40 to-transparent"></div>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span className="label-mono text-emerald-400">Top story</span>
                  <span className="h-3 w-px bg-gray-700"></span>
                  <span className="label-mono text-gray-500">
                    {categoryLabel(featured.category)}
                  </span>
                </div>
                <Link href={`/news/${featured.slug}`} className="group">
                  <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-emerald-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 mb-5 line-clamp-3 max-w-2xl leading-relaxed">
                    {featured.excerpt}
                  </p>
                </Link>
                <div className="flex flex-wrap items-center gap-3 label-mono text-gray-500">
                  <span className="text-gray-400">{featured.source}</span>
                  <span className="h-3 w-px bg-gray-700"></span>
                  <time className="tnum" dateTime={featured.date}>
                    {formatDateStr(featured.date)}
                  </time>
                  {featured.readingTime && (
                    <>
                      <span className="h-3 w-px bg-gray-700"></span>
                      <span>{featured.readingTime} min read</span>
                    </>
                  )}
                  <Link
                    href={`/news/${featured.slug}`}
                    className="ml-auto label-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Read full →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category highlights — digest list */}
      <section className="mb-12">
        <SectionHeader label="Market digest · one story per section" href="/news" linkLabel="All news" />
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {categoryHighlights.map((article, i) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span className="label-mono text-gray-300 dark:text-gray-600 tnum w-8 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="label-mono text-emerald-600 dark:text-emerald-400 w-28 sm:w-36 flex-shrink-0 hidden sm:block">
                {categoryLabel(article.category)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm md:text-base font-semibold text-gray-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 sm:hidden">
                  {categoryLabel(article.category)}
                </p>
              </div>
              <time
                dateTime={article.date}
                className="label-mono text-gray-400 dark:text-gray-500 tnum flex-shrink-0 hidden sm:block"
              >
                {formatDateStr(article.date)}
              </time>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest articles */}
      <section className="mb-12">
        <SectionHeader label="Latest briefings" href="/news" linkLabel="View all news" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {latest.length > 0 ? (
            latest.map((article) => <ArticleCard key={article.slug} article={article} />)
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
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

function SectionHeader({
  label,
  href,
  linkLabel,
}: {
  label: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="label-mono text-gray-900 dark:text-white whitespace-nowrap">
        {label}
      </h2>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
      <Link
        href={href}
        className="label-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors whitespace-nowrap"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}
