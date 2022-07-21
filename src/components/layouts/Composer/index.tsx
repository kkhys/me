import React from 'react';
import { GlobalLayout } from '^/layouts';
import type { FC, ReactNode } from 'react';

const LayoutComposer: FC<{ children: ReactNode }> = ({ children }) => (
  <GlobalLayout>{children}</GlobalLayout>
);

export default LayoutComposer;
