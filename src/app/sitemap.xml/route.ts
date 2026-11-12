// @ts-nocheck
import { getAllArticles, getAllCategories } from "@/lib/articles";
import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundpulsebd.com";

type ChangeFrequency = "hourly" | "always" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const categories = getAllCategories();

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly" as ChangeFrequency,
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${SITE_URL}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.9,
    },
    ...articles.map((article) => ({
      url: `${SITE_URL}/news/${article.slug}`,
      lastModified: new Date(article.lastUpdated || article.date),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly" as ChangeFrequency,
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as ChangeFrequency,
      priority: 0.4,
    },
  ];

  return sitemap;
}
