import { describe, it, expect } from "vitest";
import { truncateSummary } from "@/lib/utils";

describe("Summary truncation", () => {
  it("returns short text unchanged", () => {
    expect(truncateSummary("Short summary.")).toBe("Short summary.");
  });

  it("truncates to 300 characters with ellipsis", () => {
    const long = "a".repeat(400);
    const result = truncateSummary(long);
    expect(result.length).toBe(301);
    expect(result.endsWith("\u2026")).toBe(true);
  });

  it("collapses whitespace before truncating", () => {
    const result = truncateSummary("  Hello    world  ");
    expect(result).toBe("Hello world");
  });

  it("handles exactly 300 characters without ellipsis", () => {
    const exact = "a".repeat(300);
    expect(truncateSummary(exact)).toBe(exact);
  });

  it("handles empty string", () => {
    expect(truncateSummary("")).toBe("");
  });
});
