export const color = {
  // primary: '',
  primaryDarker: '#58a6ff',
  body: '#c9d1d9',
  // bodyContent: '',
  // gray: '',
  // grayLighter: '',
  grayDarker: '#727d86',
  // grayBorder: '',
  grayBorderLighter: '#313746',
  baseBackground: '#0d1117',
};

export const font = {
  fontFamily: {
    base: '-apple-system,"BlinkMacSystemFont","Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif,"Segoe UI Emoji"',
    code: '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace,"Segoe UI Emoji"',
  },
  size: {
    xxs: 'none',
    xs: '0.6rem',
    s: '0,8rem',
    m: '1rem',
    l: '1.2rem',
    xl: '1.4rem',
    xxl: '1.6rem',
    xxxl: '1.8rem',
    xxxxl: '2rem',
  },
  weight: {
    normal: 400,
    bold: 700,
  },
  letterSpacing: '0.05rem',
  lineHeight: 1.6,
};

export const breakPoint = {
  sp: 567,
  tablet: 768,
};

export const mediaQuery = {
  min: `@media screen and (min-width: ${breakPoint.sp}px), print`,
  middleMin: `@media screen and (min-width: ${breakPoint.tablet}px), print`,
  middleMax: `@media screen and (max-width: ${breakPoint.tablet - 0.02}px)`,
  middle: `@media screen and (min-width: ${breakPoint.sp}px) and (max-width: ${
    breakPoint.tablet - 0.02
  }px)`,
  max: `@media screen and (max-width: ${breakPoint.sp - 0.02}px)`,
};

export const layout = {
  maxWidth: {
    tablet: 760,
    pc: 1100,
  },
  padding: {
    sp: '0 2rem',
    pc: '0 1.5rem',
  },
};

export default {
  color,
  font,
  breakPoint,
  mediaQuery,
  layout,
};
