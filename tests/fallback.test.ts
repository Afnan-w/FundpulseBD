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

function loadExisting(articles: Article[]): Article[] {
  return [...articles];
}

describe("Fallback to last good data", () => {
  const existing: Article[] = [
    {
      title: "BSEC Issues New Circular",
      source_name: "BSEC",
      source_url: "https://bsec.gov.bd/circular-1",
      published_date: "2024-12-01T00:00:00Z",
      category: "official-notices",
      summary: "Last good summary",
      slug: "bsec-issues-new-circular",
    },
  ];

  it("keeps last good data when no new articles are fetched", () => {
    const merged = loadExisting(existing);
    expect(merged).toHaveLength(1);
    expect(merged[0].summary).toBe("Last good summary");
  });

  it("keeps last good data when fetch fails entirely (empty fetched set)", () => {
    const fetched: Article[] = []; // simulate total fetch failure
    const result = loadExisting(existing);
    for (const article of fetched) {
      if (!isDuplicate(result, article)) result.push(article);
    }
    expect(result).toHaveLength(1);
    expect(result[0].source_url).toBe("https://bsec.gov.bd/circular-1");
  });

  it("still dedups new articles against last good data", () => {
    const fetched: Article[] = [
      {
        ...existing[0],
        title: "Different title, same URL",
      },
    ];
    const result = loadExisting(existing);
    for (const article of fetched) {
      if (!isDuplicate(result, article)) result.push(article);
    }
    expect(result).toHaveLength(1);
  });
});
