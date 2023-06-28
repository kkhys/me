import type { ReactNode } from 'react';

import '#/styles/globals.css';

import { type Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

import { Footer, Header } from '#/features/global/ui';
import { Providers } from '#/app/providers';
import { SITE_METADATA } from '#/config';

const { title, siteUrl, description, developer } = SITE_METADATA;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  generator: 'Next.js',
  applicationName: title,
  referrer: 'origin-when-cross-origin',
  keywords: ['blog'],
  authors: [{ name: developer, url: siteUrl }],
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
    //     url: '/og.png',
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: '/og-alt.png',
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
  //   { media: '(prefers-color-scheme: light)', color: 'emerald' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  // manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    siteId: '5237731',
    creator: '@kkhys_',
    creatorId: '5237731',
    // images: {
    //   url: '/og.png',
    //   alt: 'kkhys.me Logo',
    // }
  },
  // verification: {
  //   google: '',
  // },
  alternates: {
    canonical: siteUrl,
    // types: {
    //   'application/rss+xml': '/rss',
    // },
  },
  category: 'technology',
} satisfies Metadata;

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html className='h-full antialiased' lang='ja'>
      <Analytics />
      <body className="flex h-full flex-col bg-gray-50 dark:bg-gray-1100 dark:bg-[url('/grid.svg')]">
        <div className='fixed inset-0 flex justify-center sm:px-8'>
          <div className='flex w-full max-w-6xl lg:px-8'>
            <div className='w-full bg-white ring-1 ring-gray-100 dark:bg-gray-1000 dark:ring-gray-300/20' />
          </div>
        </div>
        <div className='relative'>
          <Providers>
            <div className='flex min-h-screen flex-col justify-between'>
              <div>
                <Header />
                <main className='px-4 pt-14 sm:px-6 lg:px-8'>{children}</main>
              </div>
              <Footer />
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
