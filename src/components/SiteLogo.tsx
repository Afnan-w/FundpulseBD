import Link from "next/link";
import Image from "next/image";

/**
 * Header logo for FundpulseBD.
 *
 * sitelogo.png is 1254x1254; explicit width/height match the real image
 * dimensions to prevent layout shift, and CSS classes scale it down for
 * display. Rendered at a fixed 32x32 display size in both light and dark
 * mode — the source PNG has its own solid background, so no invert or
 * filter is applied (applying one would wash out the mark).
 */
export default function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="FundpulseBD home">
      <Image
        src="/sitelogo.png"
        alt="FundpulseBD"
        width={1254}
        height={1254}
        priority
        sizes="24px"
        className="h-6 w-6"
      />
      <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        Fund<span className="text-emerald-600 dark:text-emerald-400">pulse</span>BD
      </span>
    </Link>
  );
}
