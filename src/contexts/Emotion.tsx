import { ThemeProvider } from '@emotion/react';
import theme from '@/theme';
import type React from 'react';
import type { FC, ReactNode } from 'react';

const EmotionContext: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default EmotionContext;
