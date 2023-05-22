'use client';

import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }) => {
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
