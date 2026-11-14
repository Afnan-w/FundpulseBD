import { getFundBySlug } from "@/lib/funds-server";
import { isOutdated } from "@/lib/funds";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavChart from "@/components/NavChart";

import { getSiteUrl } from "@/lib/utils";

const SITE_URL = getSiteUrl();

interface FundPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: FundPageProps): Promise<Metadata> {
  const p = await params;
  const fund = getFundBySlug(p.slug);
  if (!fund) {
    return { title: "Fund not found" };
  }
  return {
    title: `${fund.name} | FundpulseBD`,
    description: `NAV and details for ${fund.name}. Educational content only — not investment advice.`,
    alternates: {
      canonical: `${SITE_URL}/mutual-funds/${fund.slug}`,
    },
  };
}

export default async function FundPage({ params }: FundPageProps) {
  const p = await params;
  const fund = getFundBySlug(p.slug);
  if (!fund) {
    notFound();
  }

  const history = fund.nav_history ?? [];
  const returns = fund.returns ?? {};
  const outdated = isOutdated(fund.data_date, 30);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/mutual-funds" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600">
          Mutual funds
        </Link>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-sm text-gray-900 dark:text-white">{fund.name}</span>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {fund.name}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Category:{" "}
          <span className={`font-medium ${fund.shariah_source ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
            {fund.category}
            {fund.shariah_source ? " (shariah-source verified)" : ""}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">NAV (value)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {fund.value.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Source</p>
            <p className="text-sm text-gray-900 dark:text-white">{fund.source_name}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Data date</p>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(fund.data_date).toLocaleDateString("en-BD")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Fetched (Dhaka):</span>
          <time dateTime={fund.fetched_at}>
            {new Date(fund.fetched_at).toLocaleString("en-BD", { timeZone: "Asia/Dhaka" })}
          </time>
          {outdated && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              · Data may be outdated
            </span>
          )}
        </div>

        {Object.keys(returns).length > 0 && (
          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Returns
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Past performance does not guarantee future results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(returns).map(([label, val]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {typeof val === "number" ? val.toFixed(2) + "%" : val}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
              NAV history
            </h2>
            <NavChart points={history} />
          </section>
        )}

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium text-gray-900 dark:text-white">Source:</span>
            <span>{fund.source_name}</span>
          </div>
          <a
            href={fund.source_url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View official source
          </a>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
          Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}
