import ratesData from "@/data/sonchayapatra.json";
import { formatDhakaTime, isOutdated, DEFAULT_INTERVAL_DAYS } from "@/lib/funds";

type RateRecord = {
  slug: string;
  scheme_name: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
  tenure?: string;
  payout_type?: string;
  official_notice_link?: string;
};

const rates: RateRecord[] = ratesData.rates ?? [];

export const metadata = {
  title: "Sonchayapatra Rates | FundpulseBD",
  description:
    "National Savings Directorate scheme rates, effective dates, tenure, and payout type. Educational content only — not investment advice.",
};

export default function SonchayapatraPage() {
  if (rates.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sonchayapatra &amp; Savings Schemes
          </h1>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No sonchayapatra rates available. Enable an NSD source to populate data.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sonchayapatra &amp; Savings Schemes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          National Savings Directorate (NSD) scheme rates and savings certificate information.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-600 dark:text-gray-300">
              <th className="pb-3 font-medium">Scheme</th>
              <th className="pb-3 font-medium text-right">Rate</th>
              <th className="pb-3 font-medium">Tenure</th>
              <th className="pb-3 font-medium">Payout type</th>
              <th className="pb-3 font-medium">Effective date</th>
              <th className="pb-3 font-medium">Source</th>
              <th className="pb-3 font-medium">Official notice</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => {
              const outdated = isOutdated(r.data_date, DEFAULT_INTERVAL_DAYS);
              return (
                <tr
                  key={r.slug}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 font-medium text-gray-900 dark:text-white">
                    {r.scheme_name}
                  </td>
                  <td className="py-3 text-right">{r.value.toFixed(2)}%</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {r.tenure || "—"}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {r.payout_type || "—"}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {new Date(r.data_date).toLocaleDateString("en-BD")}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{r.source_name}</td>
                  <td className="py-3">
                    {r.official_notice_link ? (
                      <a
                        href={r.official_notice_link}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        View notice
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Fetched (Dhaka)
                      </span>
                      <span className="text-xs text-gray-900 dark:text-white">
                        {formatDhakaTime(r.fetched_at)}
                      </span>
                      {outdated && (
                        <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                          Data may be outdated
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
        Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
        Rates shown are not real-time; check the official notice for current values.
      </p>
    </div>
  );
}
