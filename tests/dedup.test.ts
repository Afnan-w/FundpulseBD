import { describe, it, expect } from "vitest";

interface Article {
  title: string;
  source_name: string;
  source_url: string;
  published_date: string;
  category: string;
  summary: string;
  slug: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isDuplicate(existing: Article[], candidate: Article): boolean {
  if (existing.some((a) => a.source_url === candidate.source_url)) return true;
  const norm = normalizeTitle(candidate.title);
  if (existing.some((a) => normalizeTitle(a.title) === norm)) return true;
  return false;
}

function assignCategory(title: string, rules: any[]): string {
  const text = (title + " ").toLowerCase();
  let bestMatch = "";
  let bestScore = 0;

  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    for (const kw of rule.bangla_keywords) {
      if (text.includes(kw.toLowerCase())) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.category;
    }
  }

  return bestMatch || "market-news";
}

describe("De-duplication logic", () => {
  const existing: Article[] = [
    {
      title: "BSEC Issues New Circular",
      source_name: "BSEC",
      source_url: "https://bsec.gov.bd/circular-1",
      published_date: "2024-12-01T00:00:00Z",
      category: "official-notices",
      summary: "Test summary",
      slug: "bsec-issues-new-circular",
    },
  ];

  it("should detect duplicate by URL", () => {
    const candidate: Article = {
      ...existing[0],
      title: "Completely Different Title",
    };
    expect(isDuplicate(existing, candidate)).toBe(true);
  });

  it("should detect duplicate by normalized title", () => {
    const candidate: Article = {
      ...existing[0],
      source_url: "https://different-url.com/article",
      title: "bsec issues new circular",
    };
    expect(isDuplicate(existing, candidate)).toBe(true);
  });

  it("should NOT flag different articles as duplicates", () => {
    const candidate: Article = {
      title: "NSD Announces New Rates",
      source_name: "NSD",
      source_url: "https://nsd.gov.bd/rates",
      published_date: "2024-12-02T00:00:00Z",
      category: "sonchayapatra-savings",
      summary: "Another summary",
      slug: "nsd-announces-new-rates",
    };
    expect(isDuplicate(existing, candidate)).toBe(false);
  });
});

describe("Category assignment", () => {
  const rules = [
    {
      category: "official-notices",
      keywords: ["bsec", "bangladesh bank", "circular"],
      bangla_keywords: ["সিকিউরিটিজ", "বাংলাদেশ ব্যাংক"],
    },
    {
      category: "sonchayapatra-savings",
      keywords: ["sonchayapatra", "national savings", "nsd"],
      bangla_keywords: ["সঞ্চয়পত্র", "সঞ্চয়"],
    },
    {
      category: "mutual-growth-funds",
      keywords: ["mutual fund", "growth fund"],
      bangla_keywords: ["মিউচুয়াল ফান্ড", "গ্রথ ফান্ড"],
    },
    {
      category: "market-news",
      keywords: ["stock market", "dse", "share price"],
      bangla_keywords: ["শেয়ার বাজার", "ডিএসই"],
    },
    {
      category: "explainers",
      keywords: ["explainer", "how to", "guide"],
      bangla_keywords: ["কীভাবে", "বোঝা"],
    },
  ];

  it("should assign official-notices for BSEC news", () => {
    expect(assignCategory("BSEC Issues New Circular", rules)).toBe("official-notices");
  });

  it("should assign sonchayapatra-savings for NSD news", () => {
    expect(assignCategory("NSD Announces New Rates", rules)).toBe("sonchayapatra-savings");
  });

  it("should assign mutual-growth-funds for mutual fund news", () => {
    expect(assignCategory("Mutual Fund Performance Q3", rules)).toBe("mutual-growth-funds");
  });

  it("should assign market-news for stock market news", () => {
    expect(assignCategory("DSE Share Price Update", rules)).toBe("market-news");
  });

  it("should assign explainers for guide content", () => {
    expect(assignCategory("How to Open Account", rules)).toBe("explainers");
  });

  it("should use Bangla keywords", () => {
    expect(assignCategory("সঞ্চয়পত্র খবর", rules)).toBe("sonchayapatra-savings");
  });

  it("should default to market-news when no match", () => {
    expect(assignCategory("Unrelated topic about weather", rules)).toBe("market-news");
  });
});