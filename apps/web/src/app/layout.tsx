import React from 'react';

import '#/styles/globals.css';

import { ThemeProvider } from '#/lib/nextjs/theme-provider';
import { Toaster } from '#/ui/feedback';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
