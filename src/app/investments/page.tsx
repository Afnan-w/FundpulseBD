import investmentsData from "@/data/investments.json";
import { formatDhakaTime, isOutdated, DEFAULT_INTERVAL_DAYS } from "@/lib/funds";

type InvestmentRecord = {
  slug: string;
  name: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
};

const investments: InvestmentRecord[] = investmentsData.investments ?? [];

export const metadata = {
  title: "Investment Opportunities | FundpulseBD",
  description:
    "Bank FDR rates, index levels, and other investment opportunities with source and date. Educational content only — not investment advice.",
};

export default function InvestmentsPage() {
  if (investments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Other Investment Opportunities
          </h1>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No investment data available. Enable a source to populate data.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Other Investment Opportunities
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Bank FDR rates, listed index levels, and other savings opportunities.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
          Past performance does not guarantee future results.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-600 dark:text-gray-300">
              <th className="pb-3 font-medium">Opportunity</th>
              <th className="pb-3 font-medium text-right">Value</th>
              <th className="pb-3 font-medium">Source</th>
              <th className="pb-3 font-medium">Data date</th>
              <th className="pb-3 font-medium">Fetched (Dhaka)</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => {
              const outdated = isOutdated(inv.data_date, DEFAULT_INTERVAL_DAYS);
              return (
                <tr
                  key={inv.slug}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 font-medium text-gray-900 dark:text-white">
                    {inv.name}
                  </td>
                  <td className="py-3 text-right">{inv.value.toLocaleString()}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{inv.source_name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {new Date(inv.data_date).toLocaleDateString("en-BD")}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {formatDhakaTime(inv.fetched_at)}
                  </td>
                  {outdated && (
                    <td className="py-3">
                      <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                        Data may be outdated
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
        Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
        Past performance does not guarantee future results. Data is not real-time.
      </p>
    </div>
  );
}
