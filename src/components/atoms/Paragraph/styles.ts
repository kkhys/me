import { css } from '@emotion/react';
import { color, font } from '@/theme';

const normal = () => css`
  color: ${color.body};
`;

const link = () => css`
  color: ${color.primaryDarker};
`;

const s = () => css`
  font-size: ${font.size.s};
`;

const m = () => css`
  font-size: ${font.size.m};
`;

const l = () => css`
  font-size: ${font.size.l};
`;

export { normal, link, s, m, l };
