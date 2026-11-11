import { getArticleBySlug, getRelatedArticles, formatDate } from "@/lib/data";
import ShareButtons from "@/components/ShareButtons";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ArticlePageProps {
  params: { slug: string };
}

import articlesData from "@/data/articles.json";

export function generateStaticParams() {
  return articlesData.articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article not found" };
  }
  return {
    title: `${article.title} | FundpulseBD`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.published_date,
      authors: [article.source_name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
    alternates: {
      canonical: `/news/${article.slug}`,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }
  const related = getRelatedArticles(article.slug, article.category, 3);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600">Home</Link>
        <span className="text-gray-400 mx-2">/</span>
        <Link href={`/category/${article.category}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600">{article.category}</Link>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-sm text-gray-900 dark:text-white">{article.title}</span>
      </nav>
      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{article.source_name}</span>
          <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
          <time dateTime={article.published_date}>{formatDate(article.published_date)}</time>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          <p>{article.summary}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-medium text-gray-900 dark:text-white">Source:</span>
            <span>{article.source_name}</span>
          </div>
          <a href={article.source_url} target="_blank" rel="nofollow noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
            Read the original
          </a>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Share this article</h2>
          <ShareButtons title={article.title} url={`https://fundpulsebd.com/news/${article.slug}`} />
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong className="text-yellow-800 dark:text-yellow-200">Disclaimer:</strong> FundpulseBD is an educational news portal. This content is for information only and does not constitute investment advice.
          </p>
        </div>
        {related.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Related articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel.slug} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800">
                  <Link href={`/news/${rel.slug}`} className="text-sm font-medium text-gray-900 dark:text-white leading-tight hover:text-emerald-600">{rel.title}</Link>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{rel.source_name}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
