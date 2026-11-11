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
const FUNDS_PATH = join(DATA_DIR, "funds.json");
const MAX_FAILURE_RATE = 0.2;

interface FundSource {
  id: string;
  name: string;
  url: string;
  category: "growth" | "balanced" | "income" | "sharia-compliant" | "other";
  shariah_source: boolean;
  enabled: boolean;
}

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
  returns?: Record<string, number>;
  nav_history?: Array<{ date: string; nav: number }>;
}

interface FundsFile {
  funds: FundRecord[];
  generated_at: string;
}

// Placeholder sources — all disabled until explicitly enabled.
const SOURCES: FundSource[] = [
  {
    id: "icb-unit-fund",
    name: "ICB Unit Fund",
    url: "https://example.com/icb-unit-fund",
    category: "growth",
    shariah_source: false,
    enabled: false,
  },
  {
    id: "epoch-growth-fund",
    name: "Epoch Growth Fund",
    url: "https://example.com/epoch-growth-fund",
    category: "growth",
    shariah_source: false,
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

function validateFund(rec: Partial<FundRecord> & { rawValue?: unknown }): FundRecord | null {
  const value = parseMoney(rec.rawValue ?? rec.value);
  if (value === null || !Number.isFinite(value) || value <= 0) return null;
  if (!rec.source_url) return null;
  if (!isValidDate(rec.data_date)) return null;
  if (!rec.name) return null;

  return {
    slug: rec.slug || slugify(rec.name),
    name: rec.name,
    category: rec.category || "other",
    value,
    source_name: rec.source_name,
    source_url: rec.source_url,
    fetched_at: rec.fetched_at || new Date().toISOString(),
    data_date: new Date(rec.data_date).toISOString(),
    shariah_source: Boolean(rec.shariah_source),
    returns: rec.returns,
    nav_history: rec.nav_history,
  };
}

async function fetchFund(source: FundSource): Promise<FundRecord | null> {
  // Real parsing would go here once a source is enabled and its HTML/JSON shape is known.
  // Sources are disabled by default; this returns null so no false data is produced.
  try {
    const allowed = await (async () => {
      // robots check handled at fetch time if we actually request; here we skip fetching
      // because no enabled source has a verified, login-free, scrape-friendly endpoint.
      return true;
    })();
    if (!allowed) return null;
  } catch {
    return null;
  }
  return null;
}

function loadExisting(): FundRecord[] {
  const data = readJsonFile<FundsFile>(FUNDS_PATH);
  return data ? data.funds : [];
}

async function main(): Promise<void> {
  console.log("FundpulseBD fetch-funds starting...");
  const enabled = SOURCES.filter((s) => s.enabled);
  if (enabled.length === 0) {
    console.log("No enabled fund sources. Edit scripts/fetch-funds.ts to enable a source.");
    const existing = loadExisting();
    console.log(`Existing funds: ${existing.length}. No overwrite.`);
    return;
  }

  const results: { source: FundSource; record: FundRecord | null; failed: boolean }[] = [];
  for (const source of enabled) {
    try {
      const record = await fetchFund(source);
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
      )}%. Refusing to overwrite ${FUNDS_PATH}.`,
    );
    process.exit(1);
  }

  const valid = results
    .filter((r) => !!r.record)
    .map((r) => r.record!);

  const merged = [...loadExisting(), ...valid];
  writeJsonFile(FUNDS_PATH, { funds: merged, generated_at: new Date().toISOString() });
  console.log(`Saved ${merged.length} funds to ${FUNDS_PATH}.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
