import type { Preview } from '@storybook/react';

import '#/styles/globals.css';

import { androidViewports, ipadViewports, iphoneViewports, tailwindViewports } from './viewports';

const preview = {
  parameters: {
    // backgrounds: { disable: true },
    backgrounds: {
      default: 'twitter',
      values: [
        {
          name: 'twitter',
          value: '#00aced',
        },
        {
          name: 'facebook',
          value: '#3b5998',
        },
      ],
    },
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
