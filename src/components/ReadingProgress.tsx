"use client";

import { useEffect, useState, useCallback } from "react";

interface ReadingProgressProps {
  articleHeight?: number;
}

export default function ReadingProgress({ articleHeight }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const height =
      articleHeight ||
      document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    if (height <= 0) return;
    setProgress(Math.min(100, Math.round((winScroll / height) * 100)));
  }, [articleHeight]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-emerald-500 dark:bg-emerald-400 z-50"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
