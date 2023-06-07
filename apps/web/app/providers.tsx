'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      attribute='class'
    >
      {children}
    </ThemeProvider>
  );
};
