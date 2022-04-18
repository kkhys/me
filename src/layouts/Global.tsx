import { css, Global } from '@emotion/react';
import React from 'react';
import { EmotionContext } from '@/contexts';
import type { FC, ReactNode } from 'react';

const global = () => css`
  html {
    font-size: 62.5%;
  }
`;

const GlobalLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <EmotionContext>
    <Global styles={global()} />
    {children}
  </EmotionContext>
);

export default GlobalLayout;
