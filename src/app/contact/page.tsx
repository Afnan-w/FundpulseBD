import Link from "next/link";

export const metadata = {
  title: "Contact | FundpulseBD",
  description: "Contact FundpulseBD — savings and fund news for Bangladesh.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Contact Us
      </h1>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
        <p className="mb-6">
          Have a question or feedback? Reach out to us via email:
        </p>
        <a
          href="mailto:editor@fundpulsebd.example.com"
          className="text-emerald-600 dark:text-emerald-400 hover:underline text-lg font-medium"
        >
          editor@fundpulsebd.example.com
        </a>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Homepage
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/feed.xml" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                RSS Feed
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}