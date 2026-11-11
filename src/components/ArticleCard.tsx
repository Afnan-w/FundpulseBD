import Link from "next/link";
import { Article } from "@/lib/data";
import { categoryLabel } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
  lang?: "en" | "bn";
}

export default function ArticleCard({ article, lang = "en" }: ArticleCardProps) {
  return (
    <article className="flex flex-col gap-4 p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">•</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{article.source_name}</span>
            <span className="h-3 w-px bg-gray-300 dark:bg-gray-700 mx-1"></span>
            <time dateTime={article.published_date}>
              {new Date(article.published_date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <Link
            href={`/news/${article.slug}`}
            className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight group-hover:underline">
              {article.title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
            >
              {categoryLabel(article.category)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}