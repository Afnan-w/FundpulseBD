export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isDuplicateUrl(existingUrls: string[], url: string): boolean {
  return existingUrls.includes(url);
}

export function isDuplicateTitle(existingTitles: string[], title: string): boolean {
  const norm = normalizeTitle(title);
  return existingTitles.some((t) => normalizeTitle(t) === norm);
}

export function truncateSummary(text: string, maxLength: number = 300): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trimEnd() + "\u2026";
}

/**
 * Resolve the site's public base URL.
 *
 * Order of precedence:
 * 1. NEXT_PUBLIC_SITE_URL — explicit override (set in Vercel env vars)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — auto-set by Vercel in production
 * 3. VERCEL_URL — auto-set by Vercel per deployment
 * 4. Fallback: the Vercel app domain
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "https://fundpulsebd.vercel.app";
  return ("https://" + raw.replace(/^https?:\/\//, "")).replace(/\/$/, "");
}

export function canonicalUrl(path: string): string {
  return getSiteUrl() + path;
}

export function ogImageUrl(title: string): string {
  return `/api/og?title=${encodeURIComponent(title)}`;
}

