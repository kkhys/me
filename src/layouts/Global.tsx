import { css, Global } from '@emotion/react';
import React from 'react';
import type { FC, ReactNode } from 'react';

const global = () => css`
  html {
    font-size: 62.5%;
  }
`;

const GlobalLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Global styles={global()} />
    {children}
  </>
);

export default GlobalLayout;
