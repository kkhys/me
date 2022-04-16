import React from 'react';
import type { FC, ReactNode } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <p>layout test</p>
    {children}
  </>
);

export default Layout;
