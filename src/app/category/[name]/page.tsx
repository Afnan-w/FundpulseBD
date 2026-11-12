import { getArticlesByCategory, getAllCategories } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { Metadata as NextMetadata } from "next";
import { notFound } from "next/navigation";
import { categoryLabel, categoryDescription } from "@/lib/content";

interface CategoryPageProps {
  params: { name: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundpulsebd.com";

export function generateStaticParams() {
  return getAllCategories().map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<NextMetadata> {
  const p = await params;
  const label = categoryLabel(p.name);
  return {
    title: `${label} | FundpulseBD`,
    description: categoryDescription(p.name),
    openGraph: {
      title: `${label} | FundpulseBD`,
      description: categoryDescription(p.name),
      type: "website",
      url: `${SITE_URL}/category/${p.name}`,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${p.name}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const p = await params;
  const label = categoryLabel(p.name);
  const articles = getArticlesByCategory(p.name);
  const allCategories = getAllCategories();

  if (!allCategories.includes(p.name)) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {label}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {categoryDescription(p.name)}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          {articles.length} {articles.length === 1 ? "article" : "articles"} in
          this category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
