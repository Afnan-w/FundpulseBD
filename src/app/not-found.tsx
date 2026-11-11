import Link from "next/link";

export const metadata = {
  title: "Page Not Found | FundpulseBD",
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Page not found. The article or category you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors"
      >
        Return to homepage
      </Link>
    </div>
  );
}