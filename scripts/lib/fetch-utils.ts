"use strict";

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export const USER_AGENT =
  "FundpulseBD/1.0 (data aggregator; contact: editor@fundpulsebd.example.com)";
export const REQUEST_TIMEOUT_MS = 15000;
export const SAME_HOST_DELAY_MS = 3000;

const lastFetchByHost = new Map<string, number>();

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function fetchRobotsAllowed(sourceUrl: string): Promise<boolean> {
  try {
    const url = new URL(sourceUrl);
    const robotsUrl = `${url.origin}/robots.txt`;
    const res = await withTimeout(
      fetch(robotsUrl, { headers: { "User-Agent": USER_AGENT } }),
      REQUEST_TIMEOUT_MS,
    );
    if (!res.ok) return true;
    const text = await res.text();
    const path = url.pathname || "/";
    let currentAgentApplies = false;
    let disallowed = false;
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim().split("#")[0].trim();
      if (!trimmed) continue;
      const colon = trimmed.indexOf(":");
      if (colon === -1) continue;
      const key = trimmed.slice(0, colon).trim().toLowerCase();
      const value = trimmed.slice(colon + 1).trim();
      if (key === "user-agent") {
        currentAgentApplies = value === "*" || value.toLowerCase().includes("fundpulsebd");
        disallowed = false;
      } else if (key === "disallow" && currentAgentApplies) {
        if (value === "") disallowed = false;
        else if (path.startsWith(value)) disallowed = true;
      } else if (key === "allow" && currentAgentApplies) {
        if (value && path.startsWith(value)) disallowed = false;
      }
    }
    return !disallowed;
  } catch {
    return true;
  }
}

export async function waitForSameHost(sourceUrl: string): Promise<void> {
  try {
    const host = new URL(sourceUrl).host;
    const now = Date.now();
    const last = lastFetchByHost.get(host) ?? 0;
    const elapsed = now - last;
    if (elapsed < SAME_HOST_DELAY_MS) {
      await new Promise((r) => setTimeout(r, SAME_HOST_DELAY_MS - elapsed));
    }
    lastFetchByHost.set(host, Date.now());
  } catch {
    await new Promise((r) => setTimeout(r, SAME_HOST_DELAY_MS));
  }
}

export async function fetchText(sourceUrl: string): Promise<string> {
  if (!(await fetchRobotsAllowed(sourceUrl))) {
    throw new Error(`robots.txt disallows ${sourceUrl}`);
  }
  await waitForSameHost(sourceUrl);
  const res = await withTimeout(
    fetch(sourceUrl, { headers: { "User-Agent": USER_AGENT } }),
    REQUEST_TIMEOUT_MS,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function parseMoney(value: unknown): number | null {
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

export function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const d = new Date(value);
  return isFinite(d.getTime());
}

export function writeJsonFile(filePath: string, data: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function readJsonFile<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}
