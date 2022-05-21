import { css } from '@emotion/react';
import { color } from '@/theme';

const footer = () => css`
  padding: 0.9rem 0 0.8rem;
`;

const copyright = () => css`
  margin-top: 3rem;
  padding: 1.5rem;
  text-align: center;
  color: ${color.grayDarker};
  border-top: 1px solid ${color.grayBorderLighter};
`;

const sourceCode = () => css`
  color: ${color.grayDarker};
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`;

export { footer, copyright, sourceCode };
