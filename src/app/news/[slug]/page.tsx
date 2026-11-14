import { getArticleBySlug, getAllSlugs, getRelatedArticles } from "@/lib/articles";
import { marked } from "marked";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import { formatDate, categoryLabel } from "@/lib/content";
import { getSiteUrl } from "@/lib/utils";

interface ArticlePageProps {
  params: { slug: string };
}

const SITE_URL = getSiteUrl();

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const p = await params;
  const article = getArticleBySlug(p.slug);
  if (!article) {
    return { title: "Article not found | FundpulseBD" };
  }
  const articleUrl = `${SITE_URL}/news/${article.slug}`;
  const imageUrl = article.featuredImage || `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}`;
  return {
    title: `${article.title} | FundpulseBD`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.lastUpdated || article.date,
      authors: [article.source],
      url: articleUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const p = await params;
  const article = getArticleBySlug(p.slug);
  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.slug, article.category, 3);
  const articleUrl = `${SITE_URL}/news/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    datePublished: article.date,
    dateModified: article.lastUpdated || article.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    publisher: {
      "@type": "Organization",
      name: "FundpulseBD",
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: article.source,
    },
    sourceOrganization: {
      "@type": "Organization",
      name: article.source,
    },
    articleSection: categoryLabel(article.category),
    inLanguage: "en",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReadingProgress />
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
          Home
        </Link>
        <span className="text-gray-400 mx-2">/</span>
        <Link
          href={`/category/${article.category}`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          {categoryLabel(article.category)}
        </Link>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-sm text-gray-900 dark:text-white">{article.title}</span>
      </nav>

      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8 relative">
        <p className="label-mono text-emerald-600 dark:text-emerald-400 mb-3">
          {categoryLabel(article.category)}
        </p>
        <h1 className="font-display text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 label-mono text-gray-400 dark:text-gray-500 mb-6">
          <span className="text-gray-600 dark:text-gray-300">{article.source}</span>
          <span className="h-3 w-px bg-gray-300 dark:bg-gray-700 mx-1"></span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          {article.lastUpdated && (
            <>
              <span className="h-3 w-px bg-gray-300 dark:bg-gray-700 mx-1"></span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Last updated {formatDate(article.lastUpdated)}
              </span>
            </>
          )}
          {article.readingTime && (
            <>
              <span className="h-3 w-px bg-gray-300 dark:bg-gray-700 mx-1"></span>
              <span>{article.readingTime} min read</span>
            </>
          )}
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: marked(article.body) }} />

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-8">
          <div className="flex items-center gap-3 label-mono text-gray-400 dark:text-gray-500 mb-4">
            <span className="text-gray-900 dark:text-white">Source</span>
            <span>{article.source}</span>
          </div>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Read the original<span className="sr-only">, opens in a new window</span>
          </a>
        </div>

        <div className="mb-8">
          <h2 className="label-mono text-gray-900 dark:text-white mb-3">
            Share this article
          </h2>
          <ShareButtons title={article.title} url={articleUrl} />
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong className="text-yellow-800 dark:text-yellow-200">Disclaimer:</strong>
            FundpulseBD is an educational news portal. This content is for
            information only and does not constitute investment advice. We are
            not affiliated with BSEC, Bangladesh Bank, or NSD. Always consult a
            qualified financial advisor before making investment decisions.
          </p>
        </div>

        {related.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Related articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel.slug} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800">
                  <Link
                    href={`/news/${rel.slug}`}
                    className="text-sm font-medium text-gray-900 dark:text-white leading-tight hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {rel.title}
                  </Link>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span>{rel.source}</span>
                    <span className="h-3 w-px bg-gray-300 dark:bg-gray-700 mx-1"></span>
                    <time dateTime={rel.date}>{new Date(rel.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
