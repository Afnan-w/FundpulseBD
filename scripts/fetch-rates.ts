import {
  fetchText,
  isValidDate,
  parseMoney,
  readJsonFile,
  USER_AGENT,
  writeJsonFile,
} from "./lib/fetch-utils";
import { join } from "path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src/data");
const RATES_PATH = join(DATA_DIR, "sonchayapatra.json");
const MAX_FAILURE_RATE = 0.2;

interface RateSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

interface RateRecord {
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

interface RatesFile {
  rates: RateRecord[];
  generated_at: string;
}

// Placeholder sources — all disabled until explicitly enabled.
const SOURCES: RateSource[] = [
  {
    id: "nsd-sanchayapatra",
    name: "National Savings Directorate",
    url: "https://www.nsd.gov.bd/",
    enabled: false,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function validateRate(
  rec: Partial<RateRecord> & { rawValue?: unknown },
): RateRecord | null {
  const value = parseMoney(rec.rawValue ?? rec.value);
  if (value === null || !Number.isFinite(value) || value < 0 || value > 30)
    return null;
  if (!rec.source_url) return null;
  if (!isValidDate(rec.data_date)) return null;
  if (!rec.scheme_name) return null;

  return {
    slug: rec.slug || slugify(rec.scheme_name),
    scheme_name: rec.scheme_name,
    value,
    source_name: rec.source_name,
    source_url: rec.source_url,
    fetched_at: rec.fetched_at || new Date().toISOString(),
    data_date: new Date(rec.data_date).toISOString(),
    tenure: rec.tenure,
    payout_type: rec.payout_type,
    official_notice_link: rec.official_notice_link || rec.source_url,
  };
}

async function fetchRate(source: RateSource): Promise<RateRecord | null> {
  // No enabled source has a verified, login-free, scrape-friendly endpoint yet.
  return null;
}

function loadExisting(): RateRecord[] {
  const data = readJsonFile<RatesFile>(RATES_PATH);
  return data ? data.rates : [];
}

async function main(): Promise<void> {
  console.log("FundpulseBD fetch-rates starting...");
  const enabled = SOURCES.filter((s) => s.enabled);
  if (enabled.length === 0) {
    console.log("No enabled rate sources. Edit scripts/fetch-rates.ts to enable a source.");
    const existing = loadExisting();
    console.log(`Existing rates: ${existing.length}. No overwrite.`);
    return;
  }

  const results: { source: RateSource; record: RateRecord | null; failed: boolean }[] = [];
  for (const source of enabled) {
    try {
      const record = await fetchRate(source);
      results.push({ source, record, failed: record === null });
    } catch {
      results.push({ source, record: null, failed: true });
    }
  }

  const failedCount = results.filter((r) => r.failed).length;
  const failureRate = results.length ? failedCount / results.length : 0;
  if (failureRate > MAX_FAILURE_RATE) {
    console.error(
      `Failure rate ${(failureRate * 100).toFixed(1)}% exceeds ${(MAX_FAILURE_RATE * 100).toFixed(
        0,
      )}%. Refusing to overwrite ${RATES_PATH}.`,
    );
    process.exit(1);
  }

  const valid = results.filter((r) => !!r.record).map((r) => r.record!);
  const merged = [...loadExisting(), ...valid];
  writeJsonFile(RATES_PATH, { rates: merged, generated_at: new Date().toISOString() });
  console.log(`Saved ${merged.length} rates to ${RATES_PATH}.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
