import type { ReactNode } from 'react';

import '#/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';

import { SITE_METADATA } from '#/config';

const { title, siteUrl, description, developer } = SITE_METADATA;

export const metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  generator: 'Next.js',
  applicationName: title,
  referrer: 'origin-when-cross-origin',
  keywords: ['blog'],
  authors: [{ name: developer }],
  creator: developer,
  publisher: developer,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    // images: [
    //   {
    //     url: 'https://kkhys.me/og.png',
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: 'https://kkhys.me/og-alt.png',
    //     width: 1800,
    //     height: 1600,
    //     alt: 'My custom alt',
    //   },
    // ],
    locale: 'ja-JP',
    type: 'website',
  },
  // robots: {
  //   index: false,
  //   follow: true,
  //   nocache: true,
  //   googleBot: {
  //     index: true,
  //     follow: false,
  //     noimageindex: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
  // icons: {
  //   icon: '/icon.png',
  //   shortcut: '/shortcut-icon.png',
  //   apple: '/apple-icon.png',
  // },
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'cyan' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  // manifest: 'https://kkhys.me/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    // siteId: '1467726470533754880',
    creator: '@kkhys_',
    // creatorId: '1467726470533754880',
    // images: {
    //   url: 'https://kkhys.me/og.png',
    //   alt: 'kkhys.me Logo',
    // }
  },
  // verification: {
  //   google: '',
  // },
  alternates: {
    canonical: siteUrl,
    // types: {
    //   'application/rss+xml': 'https://kkhys.me/rss',
    // },
  },
  category: 'technology',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html className='h-full antialiased' lang='ja'>
      <Analytics />
      <body className="flex h-full flex-col bg-zinc-50 bg-[url('https://kkhys.me/grid.svg')] dark:bg-gray-1100">
        <div className='fixed inset-0 flex justify-center sm:px-8'>
          <div className='flex w-full max-w-7xl lg:px-8'>
            <div className='w-full bg-white ring-1 ring-zinc-100 dark:bg-gray-1000 dark:ring-zinc-300/20' />
          </div>
        </div>
        <div className='relative'>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
