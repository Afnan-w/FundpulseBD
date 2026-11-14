import Link from "next/link";
import { Article } from "@/lib/content";
import { categoryLabel } from "@/lib/content";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const date = new Date(article.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (variant === "compact") {
    return (
      <article className="flex gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
        <Link
          href={`/news/${article.slug}`}
          className="flex-1 min-w-0"
        >
          <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 label-mono text-gray-400 dark:text-gray-500">
            <span>{article.source}</span>
            <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
            <time className="tnum" dateTime={article.date}>{date}</time>
          </div>
        </Link>
        <span className="flex-shrink-0 self-start px-2 py-1 rounded border border-gray-200 dark:border-gray-700 label-mono text-emerald-600 dark:text-emerald-400 bg-gray-50 dark:bg-gray-800/60">
          {categoryLabel(article.category)}
        </span>
      </article>
    );
  }

  return (
    <article className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:border-emerald-400/60 dark:hover:border-emerald-700 hover:shadow-sm dark:hover:bg-gray-800/60 transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
        <span className="label-mono text-emerald-600 dark:text-emerald-400 truncate">
          {categoryLabel(article.category)}
        </span>
      </div>
      <Link href={`/news/${article.slug}`} className="flex-1">
        <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-3">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
          {article.excerpt}
        </p>
      </Link>
      <div className="mt-auto flex flex-wrap items-center gap-2 label-mono text-gray-400 dark:text-gray-500">
        <span className="text-gray-500 dark:text-gray-400 truncate max-w-[50%]">{article.source}</span>
        <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
        <time className="tnum" dateTime={article.date}>{date}</time>
        {article.readingTime && (
          <>
            <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
            <span>{article.readingTime} min</span>
          </>
        )}
      </div>
    </article>
  );
}
