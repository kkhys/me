import React from 'react';
import { EmotionContext } from '@/contexts';
import type { FC, ReactNode } from 'react';

const GlobalLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <EmotionContext>{children}</EmotionContext>
);

export default GlobalLayout;
