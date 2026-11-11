import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  FundRecord,
  RateRecord,
  InvestmentRecord,
} from "./funds";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src/data");
const FUNDS_PATH = join(DATA_DIR, "funds.json");
const RATES_PATH = join(DATA_DIR, "sonchayapatra.json");
const INVESTMENTS_PATH = join(DATA_DIR, "investments.json");

interface FundsFile {
  funds: FundRecord[];
  generated_at?: string;
}

interface RatesFile {
  rates: RateRecord[];
  generated_at?: string;
}

interface InvestmentsFile {
  investments: InvestmentRecord[];
  generated_at?: string;
}

export function getAllFunds(): FundRecord[] {
  if (!existsSync(FUNDS_PATH)) return [];
  try {
    const data: FundsFile = JSON.parse(readFileSync(FUNDS_PATH, "utf-8"));
    return data.funds;
  } catch {
    return [];
  }
}

export function getFundBySlug(slug: string): FundRecord | undefined {
  return getAllFunds().find((f) => f.slug === slug);
}

export function getFundsByCategory(category: string): FundRecord[] {
  return getAllFunds().filter((f) => f.category === category);
}

export function getAllFundCategories(): string[] {
  return [...new Set(getAllFunds().map((f) => f.category))].sort();
}

export function getAllRates(): RateRecord[] {
  if (!existsSync(RATES_PATH)) return [];
  try {
    const data: RatesFile = JSON.parse(readFileSync(RATES_PATH, "utf-8"));
    return data.rates;
  } catch {
    return [];
  }
}

export function getRateBySlug(slug: string): RateRecord | undefined {
  return getAllRates().find((r) => r.slug === slug);
}

export function getAllInvestments(): InvestmentRecord[] {
  if (!existsSync(INVESTMENTS_PATH)) return [];
  try {
    const data: InvestmentsFile = JSON.parse(readFileSync(INVESTMENTS_PATH, "utf-8"));
    return data.investments;
  } catch {
    return [];
  }
}

export function getInvestmentBySlug(slug: string): InvestmentRecord | undefined {
  return getAllInvestments().find((i) => i.slug === slug);
}
