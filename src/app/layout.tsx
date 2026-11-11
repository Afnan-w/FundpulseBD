import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | FundpulseBD",
    default: "FundpulseBD - Savings and fund news for Bangladesh, explained simply.",
  },
  description:
    "Savings and fund news for Bangladesh, explained simply. News about Sonchayapatra, National Savings Directorate schemes, Bangladesh Bank notices, BSEC notices, mutual funds, and growth funds. Educational content only — not investment advice.",
  keywords: [
    "sonchayapatra", "সঞ্চয়পত্র", "mutual fund", "এমইউটিএফ", "bangladesh bank", "bsec", "nsd", "national savings directorate", "savings certificate", "investment education bangladesh", "dhaka stock exchange", "dse", "capital market bangladesh",
  ],
  authors: [{ name: "FundpulseBD" }],
  openGraph: {
    title: "FundpulseBD - Savings and fund news for Bangladesh, explained simply.",
    description:
      "Savings and fund news for Bangladesh, explained simply. News about Sonchayapatra, National Savings Directorate schemes, Bangladesh Bank notices, BSEC notices, mutual funds, and growth funds. Educational content only — not investment advice.",
    type: "website",
    locale: "en_BD",
    siteName: "FundpulseBD",
  },
  twitter: {
    card: "summary_large_image",
    title: "FundpulseBD - Savings and fund news for Bangladesh, explained simply.",
    description:
      "Savings and fund news for Bangladesh, explained simply.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    {
      url: "/favicon.png",
    },
    {
      url: "/favicon.png",
      sizes: "1254x1254",
      type: "image/png",
    },
  ],
  appleTouchIcon: {
    url: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            ></script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <meta name="google-site-verification" content="" />
        <meta name="msvalidate.01" content="" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
