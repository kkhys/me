export const color = {
  // primary: '',
  // primaryDarker: '',
  body: '#c9d1d9',
  baseBackground: '#0d1117',
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
  breakPoint,
  mediaQuery,
  layout,
};
