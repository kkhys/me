import React from 'react';

import '#/styles/globals.css';

import { GoogleTagManager } from '@next/third-parties/google';

import { serverEnv } from '#/env/index.mjs';
import { inter, jetBrainsMono, newsreader, notoEmoji, notoSansJP } from '#/lib/nextjs/fonts';
import { Providers } from '#/providers';
import { Layout } from '#/ui/feature/global';
import { Toaster } from '#/ui/feedback';

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
    </body>
    {serverEnv.NODE_ENV === 'production' && <GoogleTagManager gtmId={serverEnv.GOOGLE_TAG_MANAGER_ID} />}
  </html>
);

export default RootLayout;
