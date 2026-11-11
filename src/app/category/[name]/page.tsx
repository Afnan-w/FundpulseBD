import { getArticlesByCategory, categoryLabel } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: { name: string };
}

const CATEGORY_LABELS: Record<string, string> = {
  "official-notices": "Official Notices",
  "sonchayapatra-savings": "Sonchayapatra & Savings",
  "mutual-growth-funds": "Mutual & Growth Funds",
  "market-news": "Market News",
  "explainers": "Explainers",
};

export function generateStaticParams() {
  return [
    { name: "official-notices" },
    { name: "sonchayapatra-savings" },
    { name: "mutual-growth-funds" },
    { name: "market-news" },
    { name: "explainers" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const p = await params;
  const label = CATEGORY_LABELS[p.name] || p.name;
  return {
    title: `${label} | FundpulseBD`,
    description: `Latest ${label.toLowerCase()} from Bangladesh. Educational content only — not investment advice.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const p = await params;
  const label = CATEGORY_LABELS[p.name] || p.name;
  const articles = getArticlesByCategory(p.name);

  if (articles.length === 0 && !["official-notices", "sonchayapatra-savings", "mutual-growth-funds", "market-news", "explainers"].includes(p.name)) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {label}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}