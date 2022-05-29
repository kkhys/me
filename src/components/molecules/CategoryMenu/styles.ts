import { css } from '@emotion/react';
import { color, font, mediaQuery } from '@/theme';

const item = () => css`
  width: 70px;
  margin: 0 20px 0 0;
  text-align: center;

  ${mediaQuery.max} {
    flex: 0 0 auto;
    width: 60px;
    margin: 0 0 0 15px;
  }

  // FIXME
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const iconWrapper = () => css`
  position: relative;
  padding: 2px;
  background-color: ${color.grayLighter};
  border-radius: 50%;
`;

const iconWrapperActive = () => css`
  &::after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(-225deg, #7085b6 0%, #87a7d9 50%, #def3f8 100%);
    animation: rotation 2s linear infinite; // FIXME
  }
`;

const icon = () => css`
  display: block;
  position: relative;
  z-index: 2; // FIXME
  background-color: ${color.grayLighter};
  border-radius: 50%;
`;

const iconActive = () => css`
  border: solid 2px ${color.baseBackground};
  box-sizing: content-box;
`;

const label = () => css`
  margin-top: 5px;
  font-size: ${font.size.s};
  font-weight: ${font.weight.bold};
  color: ${color.grayDarker};

  ${mediaQuery.max} {
    font-size: ${font.size.xs};
  }
`;

const nav = () => css`
  display: block;
  margin: 0;
`;

const list = () => css`
  display: flex;

  ${mediaQuery.max} {
    margin: 0 -20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    ::-webkit-scrollbar {
      display: none;
    }

    &::after {
      content: '';
      width: 40px;
      flex: 0 0 auto;
    }
  }
`;

export {
  item,
  iconWrapper,
  iconWrapperActive,
  icon,
  iconActive,
  label,
  nav,
  list,
};
