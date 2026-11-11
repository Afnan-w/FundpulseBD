import Link from "next/link";

export const metadata = {
  title: "About | FundpulseBD",
  description: "About FundpulseBD — a Bangladeshi savings and investment education news portal.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About FundpulseBD
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <p>
          FundpulseBD is a Bangladeshi savings and investment education news portal.
          We collect and summarize official and public news about Sonchayapatra,
          National Savings Directorate (NSD) schemes, Bangladesh Bank notices,
          BSEC (securities regulator) notices, mutual funds, and growth funds.
        </p>
        <p>
          Our tagline: <strong>"Savings and fund news for Bangladesh, explained simply."</strong>
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Our Purpose
      </h2>
      <p className="mb-6">
        We help Bangladeshi savers and investors stay informed about regulatory
        updates, savings schemes, and market developments. All content is for
        educational purposes only.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Editorial Policy
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700 dark:text-gray-300">
        <li>We summarize news from official and public sources with attribution.</li>
        <li>We never reproduce full article text — only summaries and links.</li>
        <li>We do not provide buy/sell recommendations or investment advice.</li>
        <li>We clearly mark all sources and link to the original publisher.</li>
        <li>We flag content that may be incorrect or problematic.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Affiliation Disclosure
      </h2>
      <p className="mb-6">
        FundpulseBD is not affiliated with BSEC, Bangladesh Bank, NSD, or any
        government regulator. We are an independent educational news portal.
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Disclaimer:</strong> Information only. Not investment advice.
          Not affiliated with BSEC, Bangladesh Bank, or NSD.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/disclaimer"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Read full disclaimer →
        </Link>
      </div>
    </div>
  );
}