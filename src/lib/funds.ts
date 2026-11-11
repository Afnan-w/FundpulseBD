export interface FundRecord {
  slug: string;
  name: string;
  category: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
  shariah_source: boolean;
  returns?: Record<string, number>;
  nav_history?: Array<{ date: string; nav: number }>;
}

export interface RateRecord {
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
}

export interface InvestmentRecord {
  slug: string;
  name: string;
  value: number;
  source_name: string;
  source_url: string;
  fetched_at: string;
  data_date: string;
}

export const FUND_CATEGORIES = [
  "growth",
  "balanced",
  "income",
  "sharia-compliant",
  "other",
] as const;

export function formatDhakaTime(iso: string): string {
  return new Date(iso).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateBD(iso: string): string {
  return new Date(iso).toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isOutdated(data_date: string, expectedIntervalDays: number): boolean {
  const d = new Date(data_date);
  if (!isFinite(d.getTime())) return true;
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > expectedIntervalDays;
}

export const DEFAULT_INTERVAL_DAYS = 30;
