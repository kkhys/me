import type React from 'react';
import type { FC, ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from '@/theme';

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <main>{children}</main>
  </ThemeProvider>
);

export default Layout;
