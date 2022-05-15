import { Global } from '@emotion/react';
import React from 'react';
import * as styles from './styles';
import type { FC, ReactNode } from 'react';

const GlobalLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Global styles={styles.global()} />
    {children}
  </>
);

export default GlobalLayout;
