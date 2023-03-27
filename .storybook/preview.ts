import type { Preview } from '@storybook/react';
import '../styles/globals.css';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  iphone14ProMax: {
    name: 'iPhone 14 Pro Max',
    styles: {
      width: '428px',
      height: '928px',
    },
  },
  iphone14Pro: {
    name: 'iPhone 14 Pro',
    styles: {
      width: '390px',
      height: '844px',
    },
  },
  iphone14Plus: {
    name: 'iPhone 14 Plus',
    styles: {
      width: '428px',
      height: '926px',
    },
  },
  iphone14: {
    name: 'iPhone 14',
    styles: {
      width: '390px',
      height: '844px',
    },
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        ...customViewports,
        ...INITIAL_VIEWPORTS, // TODO: customViewports に組み込む
      },
    },
  },
};

export default preview;
