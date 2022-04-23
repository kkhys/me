import React from 'react';
import GlobalLayout from '@/layouts/Global';
import type { FC, ReactNode } from 'react';

const Index: FC<{ children: ReactNode }> = ({ children }) => (
  <GlobalLayout>{children}</GlobalLayout>
);

export default Index;
