import type { Preview } from '@storybook/react';

import '#/styles/globals.css';

import { androidViewports, ipadViewports, iphoneViewports, tailwindViewports } from './viewports';

const preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      // toolbar: {
      //   title: 'Theme',
      //   icon: 'photo',
      //   items: ['system', 'light', 'dark'],
      //   dynamicTitle: true,
      // },
    },
  },
  parameters: {
    backgrounds: { disable: true },
    layout: 'centered',
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
    viewport: {
      viewports: {
        ...iphoneViewports,
        ...ipadViewports,
        ...androidViewports,
        ...tailwindViewports,
      },
    },
  },
} satisfies Preview;

export default preview;
