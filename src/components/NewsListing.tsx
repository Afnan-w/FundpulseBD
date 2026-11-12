"use client";

import { useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { Article, categoryLabel } from "@/lib/content";

interface NewsListingProps {
  articles: Article[];
  categories: string[];
  initialCategory?: string | null;
  initialQuery?: string | null;
}

export default function NewsListing({
  articles,
  categories,
  initialCategory,
  initialQuery,
}: NewsListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [activeCategory, setActiveCategory] = useState(
    initialCategory ?? null,
  );
  const synced = useRef(false);

  const fuse = useMemo(
    () =>
      new Fuse(articles, {
        keys: ["title", "excerpt", "source", "tags"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [articles],
  );

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (query.trim()) {
      const searchResults = fuse.search(query.trim());
      const searchSlugs = new Set(
        searchResults.map((r) => r.item?.slug).filter(Boolean),
      );
      result = result.filter((a) => searchSlugs.has(a.slug));
    }
    return result;
  }, [articles, activeCategory, query, fuse]);

  const syncUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory) params.set("category", activeCategory);
    else params.delete("category");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    router.replace(`/news?${params.toString()}`, { scroll: false });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (synced.current) syncUrl();
    else synced.current = true;
  };

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    if (synced.current) syncUrl();
    else synced.current = true;
  };

  const allCount = articles.length;
  const count = filtered.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
            !activeCategory
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
              : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          All ({allCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
          >
            {categoryLabel(cat)} ({articles.filter((a) => a.category === cat).length})
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {(activeCategory || query.trim()) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {count} {count === 1 ? "article" : "articles"}
          {activeCategory ? ` in ${categoryLabel(activeCategory)}` : ""}
          {query.trim() ? ` matching “${query}”` : ""}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              No articles found.
            </p>
            <Link
              href="/news"
              className="mt-3 inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
