"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import SiteLogo from "./SiteLogo";

const CATEGORIES = [
  { key: "official-notices", label: "Notices" },
  { key: "sonchayapatra-savings", label: "Savings" },
  { key: "mutual-growth-funds", label: "Funds" },
  { key: "market-news", label: "Markets" },
  { key: "explainers", label: "Explainers" },
];

const FULL_LABELS: Record<string, string> = {
  "official-notices": "Official Notices",
  "sonchayapatra-savings": "Sonchayapatra & Savings",
  "mutual-growth-funds": "Mutual & Growth Funds",
  "market-news": "Market News",
  explainers: "Explainers",
};

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden md:block bg-gray-950 text-gray-400 dark:bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-7 text-[11px]">
            <p className="label-mono !text-[10px] !tracking-[0.18em] text-gray-400">
              Savings &amp; fund news for Bangladesh — explained simply
            </p>
            <div className="flex items-center gap-5">
              <span className="label-mono !text-[10px] text-emerald-400/90 flex items-center gap-1.5">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Updated daily
              </span>
              <a
                href="/feed.xml"
                className="label-mono !text-[10px] text-gray-400 hover:text-emerald-400 transition-colors"
              >
                RSS
              </a>
              <span className="label-mono !text-[10px] text-gray-500">
                Educational · Not investment advice
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-[0_1px_0_rgb(0_0_0/0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <SiteLogo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/category/${cat.key}`}
                  className="label-mono text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-emerald-500 after:transition-all hover:after:w-full"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
              <DarkModeToggle />
              <button
                onClick={() => setMenuOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors"
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
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 translate-x-full sm:translate-x-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold font-display text-gray-900 dark:text-white">FundpulseBD</Link>
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
                    {FULL_LABELS[cat.key]}
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
