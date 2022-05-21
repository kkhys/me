import { css } from '@emotion/react';
import { color, font } from '@/theme';

const global = () => css`
  body {
    color: ${color.body};
    background: ${color.baseBackground};
    font-family: ${font.fontFamily.base};
    letter-spacing: ${font.letterSpacing};
    line-height: ${font.lineHeight};
    font-weight: ${font.weight.normal};
  }
`;

export { global };
