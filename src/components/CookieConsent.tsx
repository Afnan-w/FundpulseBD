'use client';

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("fundpulsebd-cookie-consent");
    if (!accepted && typeof window !== "undefined") {
      setShow(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("fundpulsebd-cookie-consent", "accepted");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          We use essential cookies to support analytics if enabled.{" "}
          <a href="/disclaimer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Learn more
          </a>
          .
        </div>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}