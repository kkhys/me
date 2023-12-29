import React from 'react';

import '#/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { me, site } from '#/config';
import { inter, jetBrainsMono, newsreader, notoEmoji, notoSansJP } from '#/lib/nextjs/fonts';
import { Providers } from '#/providers';
import { Layout } from '#/ui/feature/global';
import { Toaster } from '#/ui/feedback';

export const metadata = {
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
  description: site.description,
  generator: 'Next.js',
  applicationName: site.title,
  referrer: 'origin-when-cross-origin',
  category: 'blog',
  keywords: ['blog', 'developer'],
  authors: [
    {
      name: me.name,
      url: site.url.base,
    },
  ],
  creator: me.name,
  publisher: me.name,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  alternates: {
    canonical: site.url.base,
  },
  openGraph: {
    type: 'website',
    url: site.url.base,
    siteName: site.title,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    siteId: '5237731',
    creator: me.social.x.id,
    creatorId: '5237731',
  },
} satisfies Metadata;

export const viewport = {
  themeColor: '#0a0a0b',
} satisfies Viewport;

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html
    lang='ja'
    className={`h-full antialiased ${notoSansJP.className} ${inter.variable} ${newsreader.variable} ${jetBrainsMono.variable} ${notoEmoji.variable}`}
    suppressHydrationWarning
  >
    <body className='flex h-full'>
      <Providers>
        <div className='flex w-full'>
          <Layout>{children}</Layout>
        </div>
        <Toaster />
      </Providers>
      <Analytics />
      <SpeedInsights />
    </body>
    <GoogleTagManager gtmId={site.google.tagManagerId} />
  </html>
);

export default RootLayout;
