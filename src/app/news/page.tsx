import { getAllArticles, getAllCategories } from "@/lib/articles";
import { Metadata } from "next";
import NewsListing from "@/components/NewsListing";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundpulsebd.com";

interface NewsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export const metadata: Metadata = {
  title: "News",
  description:
    "All savings and fund news for Bangladesh: Sonchayapatra, National Savings Directorate schemes, Bangladesh Bank and BSEC notices, mutual funds, and market news. Educational content only — not investment advice.",
  openGraph: {
    title: "News | FundpulseBD",
    description:
      "All savings and fund news for Bangladesh. Educational content only — not investment advice.",
    type: "website",
    url: `${SITE_URL}/news`,
  },
  alternates: {
    canonical: `${SITE_URL}/news`,
  },
};

export default async function NewsPage({
  searchParams,
}: NewsPageProps) {
  const { category, q } = await searchParams;
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          News
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Savings and fund news for Bangladesh, explained simply.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Information only. Not investment advice. Not affiliated with BSEC,
          Bangladesh Bank, or NSD.
        </p>
      </div>

      <NewsListing
        articles={articles}
        categories={categories}
        initialCategory={category ?? null}
        initialQuery={q ?? null}
      />

      <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              About FundpulseBD
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              FundpulseBD is an educational news portal covering savings and
              fund news for Bangladesh. All articles are original summaries
              with links to the original sources. We never host full article
              text.
            </p>
          </div>
          <div className="lg:col-span-2">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
