import { css } from '@emotion/react';
import { color } from '@/theme';

const global = () => css`
  html {
    font-size: 62.5%;
  }
  body {
    color: ${color.body};
    background: ${color.baseBackground};
  }
`;

export { global };
