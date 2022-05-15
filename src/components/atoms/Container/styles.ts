import { css } from '@emotion/react';
import { layout, mediaQuery } from '@/theme';

const container = () => css`
  max-width: ${layout.maxWidth.pc}px;
  margin: 0 auto;
  padding: ${layout.padding.pc};

  ${mediaQuery.middleMax} {
    max-width: ${layout.maxWidth.tablet}px;
  }

  ${mediaQuery.max} {
    padding: ${layout.padding.sp};
  }
`;

export { container };
