import Link from "next/link";
import { Article } from "@/lib/data";
import { categoryLabel } from "@/lib/data";

interface RelatedArticlesProps {
  currentSlug: string;
  category: string;
}

export default function RelatedArticles({ currentSlug, category }: RelatedArticlesProps) {
  const allArticles: Article[] = require("@/lib/data").getArticlesByCategory(category);
  const related = allArticles.filter((a: Article) => a.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Related articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((article: Article) => (
          <div
            key={article.slug}
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                •
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/news/${article.slug}`}
                  className="text-sm font-medium text-gray-900 dark:text-white leading-tight hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group-hover:underline"
                >
                  {article.title}
                </Link>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span>{article.source_name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}