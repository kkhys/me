const fullHeight = '100vh - 20vh';

export const iphoneViewports = {
  iphone15: {
    name: 'iPhone 15',
    styles: {
      width: '393px',
      height: '852px',
    },
    type: 'mobile',
  },
  iphone15Plus: {
    name: 'iPhone 15 Plus',
    styles: {
      width: '430px',
      height: '932px',
    },
    type: 'mobile',
  },
  iphone15Pro: {
    name: 'iPhone 15 Pro',
    styles: {
      width: '393px',
      height: '852px',
    },
    type: 'mobile',
  },
  iphone15ProMax: {
    name: 'iPhone 15 Pro Max',
    styles: {
      width: '430px',
      height: '932px',
    },
    type: 'mobile',
  },
};

// TODO: Add android viewports
export const androidViewports = {};

export const ipadViewports = {
  ipad: {
    name: 'iPad (10th generation)',
    styles: {
      width: '820px',
      height: '1180px',
    },
    type: 'tablet',
  },
  ipadMini: {
    name: 'iPad Mini (6th generation)',
    styles: {
      width: '744px',
      height: '1133px',
    },
    type: 'tablet',
  },
  ipadAir: {
    name: 'iPad Air (5th generation)',
    styles: {
      width: '820px',
      height: '1180px',
    },
    type: 'tablet',
  },
  ipadPro11: {
    name: 'iPad Pro 11 (4th generation)',
    styles: {
      width: '834px',
      height: '1194px',
    },
    type: 'tablet',
  },
  ipadPro12: {
    name: 'iPad Pro 12.9 (6th generation)',
    styles: {
      width: '1024px',
      height: '1366px',
    },
    type: 'tablet',
  },
};

/**
 * @see: https://tailwindcss.com/docs/responsive-design
 */
export const tailwindViewports = {
  tailwindSm: {
    name: 'tailwind sm',
    styles: {
      width: '640px',
      height: fullHeight,
    },
    type: 'other',
  },
  tailwindMd: {
    name: 'tailwind md',
    styles: {
      width: '768px',
      height: fullHeight,
    },
    type: 'other',
  },
  tailwindLg: {
    name: 'tailwind lg',
    styles: {
      width: '1024px',
      height: fullHeight,
    },
    type: 'other',
  },
  tailwindXl: {
    name: 'tailwind xl',
    styles: {
      width: '1280px',
      height: fullHeight,
    },
    type: 'other',
  },
  tailwind2xl: {
    name: 'tailwind 2xl',
    styles: {
      width: '1536px',
      height: fullHeight,
    },
    type: 'other',
  },
};
