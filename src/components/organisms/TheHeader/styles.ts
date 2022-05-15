import { css } from '@emotion/react';
import { mediaQuery } from '@/theme';

const header = () => css`
  width: 100%;
  padding: 1.4rem 0;
`;

const inner = () => css`
  position: relative;
`;

const link = () => css`
  width: 100%;
  display: block;
`;

const logo = () => css`
  display: block;
  ${mediaQuery.max} {
    margin: 0 auto;
  }
`;

export { header, inner, link, logo };
