import { css } from '@emotion/react';
import { font, mediaQuery } from '@/theme';
import { hex2hsl, hex2rgba } from '@/utils/color';

const badge = (color: string) => {
  const hsl = hex2hsl(color);

  return css`
    display: inline;
    padding: 6px 10px;
    font-size: ${font.size.s};
    border-radius: 2rem;
    font-weight: ${font.weight.bold};
    color: hsl(
      ${hsl[0]},
      ${hsl[1]}%,
      ${hsl[2] && hsl[2] <= 95 ? hsl[2] + 5 : hsl[2]}%
    );
    border: 1px solid ${color};
    background-color: rgba(${hex2rgba(color, 0.18).toString()});

    ${mediaQuery.middleMax} {
      font-size: ${font.size.xs};
      padding: 2.5px 6px;
    }
  `;
};

export { badge };
