import { describe, it, expect } from "vitest";
import { slugify, normalizeTitle, isDuplicateUrl, isDuplicateTitle } from "@/lib/utils";

describe("Category rule utilities", () => {
  describe("slugify", () => {
    it("should convert a title to a URL-friendly slug", () => {
      expect(slugify("BSEC Issues New Circular")).toBe("bsec-issues-new-circular");
    });

    it("should trim to max length", () => {
      const longTitle = "A".repeat(200);
      expect(slugify(longTitle).length).toBeLessThanOrEqual(120);
    });
  });

  describe("normalizeTitle", () => {
    it("should normalize titles for comparison", () => {
      expect(normalizeTitle("  Hello World!  ")).toBe("hello world");
    });
  });

  describe("isDuplicateUrl", () => {
    it("should detect duplicate URLs", () => {
      expect(isDuplicateUrl(["https://example.com/a"], "https://example.com/a")).toBe(true);
      expect(isDuplicateUrl(["https://example.com/a"], "https://example.com/b")).toBe(false);
    });
  });

  describe("isDuplicateTitle", () => {
    it("should detect duplicate titles after normalization", () => {
      expect(isDuplicateTitle(["Hello World"], "hello world")).toBe(true);
      expect(isDuplicateTitle(["Hello World"], "Different title")).toBe(false);
    });
  });
});

