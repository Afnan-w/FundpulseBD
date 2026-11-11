"use client";

import { useMemo, useState } from "react";
import { formatDhakaTime, isOutdated, DEFAULT_INTERVAL_DAYS } from "@/lib/funds";
import Link from "next/link";

interface FundRecord {
  slug: string;
  name: string;
  category: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
  shariah_source: boolean;
}

interface FundsTableProps {
  initialFunds: FundRecord[];
  categories: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  growth: "Growth",
  balanced: "Balanced",
  income: "Income",
  "sharia-compliant": "Sharia-compliant",
  other: "Other",
};

const FUND_CATEGORIES = [
  "growth",
  "balanced",
  "income",
  "sharia-compliant",
  "other",
] as string[];

export default function FundsTable({ initialFunds, categories }: FundsTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialFunds.filter((f) => {
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.source_name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      const matchCat = !category || f.category === category;
      return matchQuery && matchCat;
    });
  }, [initialFunds, search, category]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search funds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All categories</option>
          {FUND_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] || c}
            </option>
          ))}
          {categories
            .filter((c) => !FUND_CATEGORIES.includes(c))
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
        <button
          onClick={() => {
            setSearch("");
            setCategory("");
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
        >
          Clear
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No mutual funds found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-600 dark:text-gray-300">
                <th className="pb-3 font-medium">Fund</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">NAV (value)</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Data date</th>
                <th className="pb-3 font-medium">Fetched (Dhaka)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const outdated = isOutdated(f.data_date, DEFAULT_INTERVAL_DAYS);
                return (
                  <tr
                    key={f.slug}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3">
                      <Link
                        href={`/mutual-funds/${f.slug}`}
                        className={`font-medium ${f.shariah_source ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white"} hover:underline`}
                      >
                        {f.name}
                        {f.shariah_source && (
                          <span className="text-xs opacity-60 ml-1">(shariah-source verified)</span>
                        )}
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium border bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800">
                        {CATEGORY_LABELS[f.category] || f.category}
                      </span>
                    </td>
                    <td className="py-3 text-right">{f.value.toLocaleString()}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{f.source_name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {new Date(f.data_date).toLocaleDateString("en-BD")}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {formatDhakaTime(f.fetched_at)}
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
      )}
    </div>
  );
}
