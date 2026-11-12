"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!res.ok) throw new Error("Signup failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-6 md:p-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Stay updated
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Get notified when we publish new savings and fund news for Bangladesh.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <div>
          <label htmlFor="newsletter-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="newsletter-name"
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="newsletter-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium transition-colors"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
        {status === "success" && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Thanks! You&rsquo;re subscribed.
          </p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        This is a placeholder signup. No data is stored beyond this session.
      </p>
    </section>
  );
}
