import fundsData from "@/data/funds.json";
import FundsTable from "./FundsTable";

type FundRecord = {
  slug: string;
  name: string;
  category: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
  shariah_source: boolean;
};

const CATEGORY_ORDER = [
  "growth",
  "balanced",
  "income",
  "sharia-compliant",
  "other",
];

const CATEGORY_LABELS: Record<string, string> = {
  growth: "Growth",
  balanced: "Balanced",
  income: "Income",
  "sharia-compliant": "Sharia-compliant",
  other: "Other",
};

const funds: FundRecord[] = fundsData.funds ?? [];
const categories = [...new Set(funds.map((f) => f.category))].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
);

export const metadata = {
  title: "Mutual Funds | FundpulseBD",
  description:
    "Mutual fund NAV, category, and source information for Bangladesh. Educational content only — not investment advice.",
};

export default function MutualFundsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mutual Funds
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          NAV, category, and source information for mutual funds in Bangladesh.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Information only. Not investment advice. Not affiliated with BSEC, Bangladesh Bank, or NSD.
          Past performance does not guarantee future results.
        </p>
      </div>

      <FundsTable initialFunds={funds} categories={categories} />
    </div>
  );
}
