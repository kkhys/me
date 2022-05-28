import { css } from '@emotion/react';
import { color, font, mediaQuery } from '@/theme';

const size = {
  pc: {
    wrapper: '90px',
    icon: '45px',
  },
  tablet: {
    wrapper: '70px',
    icon: '38px',
  },
};

const root = () => css`
  display: flex;
  align-items: start;
  padding: 1.4rem 0;
  color: ${color.body};
  border-top: 1px solid ${color.grayLighter};

  ${mediaQuery.middleMax} {
    padding: 1rem 0;
  }
`;

const emoji = () => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${size.pc.wrapper};
  height: ${size.pc.wrapper};
  margin: 0;
  background-color: ${color.grayLighter};
  border-radius: 12px;
  font-size: ${font.size.xl};

  img {
    width: ${size.pc.icon};
    height: ${size.pc.icon};
  }

  ${mediaQuery.middleMax} {
    width: ${size.tablet.wrapper};
    height: ${size.tablet.wrapper};

    img {
      width: ${size.tablet.icon};
      height: ${size.tablet.icon};
    }
  }
`;

const content = () => css`
  width: calc(100% - ${size.pc.wrapper});
  padding-left: 20px;

  ${mediaQuery.middleMax} {
    width: calc(100% - ${size.tablet.wrapper});
    padding-left: 15px;
  }
`;

const heading = () => css`
  font-size: ${font.size.xl};
  font-weight: ${font.weight.bold};
  line-height: 1.4; // FIXME
`;

const createdAt = () => css`
  display: block;
  margin-bottom: 0.2rem;
  letter-spacing: ${font.letterSpacing};
  font-size: ${font.size.s};
  color: ${color.grayDarker};
`;

export { root, emoji, content, heading, createdAt };
