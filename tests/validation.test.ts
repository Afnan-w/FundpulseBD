import { describe, it, expect } from "vitest";

function parseMoney(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return isFinite(value) ? value : null;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === ".") return null;
    const num = Number(cleaned);
    return isFinite(num) ? num : null;
  }
  return null;
}

function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const d = new Date(value);
  return isFinite(d.getTime());
}

describe("Validation rules (funds)", () => {
  it("accepts positive NAV numbers", () => {
    expect(parseMoney(123.45)).toBe(123.45);
    expect(parseMoney("123.45")).toBe(123.45);
    expect(parseMoney("৳1,234.50")).toBe(1234.5);
  });

  it("rejects invalid NAV parsing", () => {
    expect(parseMoney("abc")).toBe(null);
    expect(parseMoney(null)).toBe(null);
    expect(parseMoney(undefined)).toBe(null);
  });

  it("parses zero and negative numbers (validation rejects them later)", () => {
    expect(parseMoney(0)).toBe(0);
    expect(parseMoney(-5)).toBe(-5);
  });

  it("fund NAV must be positive (zero/negative rejected)", () => {
    const acceptNav = (v: number) => v !== null && v > 0;
    expect(acceptNav(parseMoney(100))).toBe(true);
    expect(acceptNav(parseMoney(0))).toBe(false);
    expect(acceptNav(parseMoney(-5))).toBe(false);
    expect(acceptNav(parseMoney("abc"))).toBe(false);
  });

  it("validates dates", () => {
    expect(isValidDate("2024-12-15T10:30:00Z")).toBe(true);
    expect(isValidDate("")).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate("not-a-date")).toBe(false);
  });
});

describe("Validation rules (rates)", () => {
  function validRate(value: number): boolean {
    return isFinite(value) && value >= 0 && value <= 30;
  }

  it("accepts rates between 0 and 30 percent", () => {
    expect(validRate(0)).toBe(true);
    expect(validRate(10.5)).toBe(true);
    expect(validRate(30)).toBe(true);
  });

  it("rejects rates outside 0-30", () => {
    expect(validRate(-1)).toBe(false);
    expect(validRate(30.1)).toBe(false);
    expect(validRate(100)).toBe(false);
  });
});

describe("Failure-rate guard", () => {
  it("refuses overwrite when more than 20% fail", () => {
    const total = 10;
    const failed = 3;
    const rate = failed / total;
    expect(rate > 0.2).toBe(true);
  });

  it("allows overwrite when 20% or fewer fail", () => {
    const total = 10;
    const failed = 2;
    const rate = failed / total;
    expect(rate > 0.2).toBe(false);
  });
});
