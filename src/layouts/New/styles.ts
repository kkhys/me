import { css } from '@emotion/react';
import { layout, mediaQuery } from '@/theme';

const container = () => css`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 85vh;
  margin-top: 1rem;

  ${mediaQuery.max} {
    margin-top: 0.5rem;
  }

  ${mediaQuery.middleMax} {
    display: block;
  } ;
`;

const main = () => css`
  width: ${layout.width.pc}px;

  ${mediaQuery.middleMax} {
    width: 100%;
  }
`;

const articleCards = () => css`
  margin-top: 1.5rem;
`;

export { container, main, articleCards };
