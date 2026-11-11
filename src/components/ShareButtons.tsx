'use client';

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "Facebook",
      url: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.04C6.05 2.04 2 6.09 2 12.05c0 5.23 3.62 9.54 8.3 10.56v-7.42H4.83v-2.83h3.47V8.47c0-2.32 1.33-3.91 3.46-3.91 1.02 0 1.53.09 1.85.16v3.13H16v2.83h-3.17c-1 0-1.27.6-1.27 1.3v2.83h3.9l-.56 2.83H8.54v7.42c3.76-.95 7.24-4.69 7.24-9.24.01-5.16-3.4-9.01-8.28-9.01z" />
        </svg>
      ),
    },
    {
      name: "X",
      url: 'https://twitter.com/intent/tweet?text=' + shareTitle + '&url=' + shareUrl,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: 'https://wa.me/?text=' + shareTitle + '%20' + shareUrl,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.66 6.03c-2.4-2.48-6.02-2.82-8.68-.46-1.98 1.74-2.25 4.36-1.4 6.75-.1.11-.18.22-.28.34-.52.62-.78 1.38-.85 2.17-.27.25-.52.51-.73.79-.33.42-.5.9-.46 1.43l-.03.36c-.02.54-.02 1.07-.02 1.61 0 2.61 1.15 4.34 1.69 4.96.45.54 1.08 1.1 1.9 1.13 1.75.05 3.09-1.16 3.74-2.01.02.01.06.03.09.04.72.11 1.43.11 2.06 0 .5-.08.81-.19.81-.24 0-.14-3.05-1.99-3.69-4.84-.2-1.09-.41-2.48-.04-3.91.03-.04.04-.08.05-.13.12-.61.28-1.19.5-1.72.1-.23.14-.45.12-.67a1 1 0 0 0-.14-.38c.46-.14.9-.37 1.28-.69.63-.52.97-1.17.97-1.88 0-.67-.21-1.28-.56-1.77-.01-.01-.01-.03-.02-.04l-.23-.39c-.21-.38-.48-.77-.82-1.13-.24-.24-.43-.29-.5-.32-.41-.19-1.3-.11-1.94.24-.63.34-.96 1.04-.96 1.84 0 1.12.93 1.72 1.19 1.83.37.16.53.23 1.08.23.04 0 .05-.01.06-.01.38-.02.74-.15 1.02-.43.39-.39.63-.92.63-1.52 0-.53-.19-.98-.49-1.35 2.11-1.07 3.75-3.39 3.54-6.02" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      url: 'https://t.me/share/url?url=' + shareUrl + '&text=' + shareTitle,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.91 15.26l-3.04-3.03a1 1 0 0 0-1.46 0l-4.6 4.6a1 1 0 0 1-1.46 0l-1.23-1.21a1 1 0 0 1 0-1.42l4.2-4.18a1 1 0 0 1 1.46 0l6.56 6.54a1 1 0 0 1 0 1.41l-1.28 1.27a1 1 0 0 1-.15.11" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-7 8h-3v-7h3v7zm-2.41-9.41c-.16-.16-.39-.16-.55 0s-.16.39 0 .55l.11.11c.08.08.18.12.29.12s.21-.04.29-.12l.11-.11c.16-.16.16-.39 0-.55-.08-.08-.18-.12-.29-.12s-.21.04-.29.12zM11 11h-3v7h3v-7zm13.5 0c0 2.76-2.24 5-5 5h-3v-7h3c1.38 0 2.5-.88 2.5-2.5 0-1.12-.69-2.06-1.6-2.38-.43-.15-1.12-.24-1.75-.24-.61 0-1.29.07-1.83.27-.57.22-1.01.61-1.31 1.11-.3.5-.46 1.08-.46 1.71 0 1.64 1.12 2.93 2.6 2.93h3v-7z" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: 'mailto:?subject=' + shareTitle + '&body=Check out this article: ' + url,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleNativeShare}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Native share"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={'Share on ' + p.name}
        >
          {p.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Copy link"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        <span className="sr-only">{copied ? "Copied!" : "Copy link"}</span>
      </button>
      {copied && (
        <span className="px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium">
          Copied!
        </span>
      )}
    </div>
  );
}
