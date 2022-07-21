import React from 'react';
import { Helmet } from 'react-helmet';
import type { FC, ReactNode } from 'react';

const GlobalLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Helmet htmlAttributes={{ class: 'dark' }} />
    {children}
  </>
);

export default GlobalLayout;
