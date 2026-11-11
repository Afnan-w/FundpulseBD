"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

const CATEGORIES = [
  { key: "official-notices", label: "Official Notices" },
  { key: "sonchayapatra-savings", label: "Sonchayapatra & Savings" },
  { key: "mutual-growth-funds", label: "Mutual & Growth Funds" },
  { key: "market-news", label: "Market News" },
  { key: "explainers", label: "Explainers" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <span className="relative inline-block">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
              <span className="absolute -inset-0.5 h-full w-full rounded-full opacity-20 animate-pulse bg-emerald-500"></span>
            </span>
            <span>FundpulseBD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/category/${cat.key}`}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <DarkModeToggle />
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 translate-x-full sm:translate-x-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">FundpulseBD</Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <nav className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/category/${cat.key}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  About
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Disclaimer
                </Link>
              </nav>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

