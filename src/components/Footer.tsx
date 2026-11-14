import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Fund<span className="text-emerald-600 dark:text-emerald-400">pulse</span>BD
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Savings and fund news for Bangladesh, explained simply. Educational
              content only — not investment advice.
            </p>
          </div>

          <div>
            <h3 className="label-mono text-gray-900 dark:text-white mb-4">
              Sections
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/official-notices" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Official Notices
                </Link>
              </li>
              <li>
                <Link href="/category/sonchayapatra-savings" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Sonchayapatra & Savings
                </Link>
              </li>
              <li>
                <Link href="/category/mutual-growth-funds" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Mutual & Growth Funds
                </Link>
              </li>
              <li>
                <Link href="/category/market-news" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Market News
                </Link>
              </li>
              <li>
                <Link href="/category/explainers" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Explainers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-mono text-gray-900 dark:text-white mb-4">
              Legal &amp; Info
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="/feed.xml"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-mono text-gray-900 dark:text-white mb-4">
              Source Credit
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              All articles link to their original sources. FundpulseBD does not
              host or reproduce full article text.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xs">
              Not affiliated with BSEC, Bangladesh Bank, or NSD.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="label-mono text-gray-400 dark:text-gray-500">
            FundpulseBD — Educational news portal · Information only · Not investment advice · Not affiliated with BSEC, Bangladesh Bank, or NSD
          </p>
        </div>
      </div>
    </footer>
  );
}