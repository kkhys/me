import React from 'react';
import * as styles from './styles';
import type { FC, ReactNode } from 'react';

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <div css={styles.container()}>{children}</div>
);

export default Container;
