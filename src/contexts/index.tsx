import { ThemeProvider } from '@emotion/react';
import React from 'react';
import theme from '@/theme';
import type { FC, ReactNode } from 'react';

const Index: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Index;
