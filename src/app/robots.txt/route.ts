// @ts-ignore - Next.js 16 MetadataRoute compatibility
// @ts-nocheck
import { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils";

const SITE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}