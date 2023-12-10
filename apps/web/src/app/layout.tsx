import React from 'react';

import '#/styles/globals.css';

import { inter, jetBrainsMono, newsreader, notoSansJP } from '#/lib/nextjs/fonts';
import { ThemeProvider } from '#/lib/nextjs/theme-provider';
import { Layout } from '#/ui/feature/global';
import { Toaster } from '#/ui/feedback';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html
    lang='ja'
    className={`h-full antialiased ${notoSansJP.className} ${inter.variable} ${newsreader.variable} ${jetBrainsMono.variable}`}
  >
    <body className='flex h-full'>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <div className='flex w-full'>
          <Layout>{children}</Layout>
        </div>
        <Toaster />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
