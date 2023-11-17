import type { Preview } from '@storybook/react';

import '#/styles/globals.css';

import { androidViewports, ipadViewports, iphoneViewports, tailwindViewports } from './viewports';

const preview = {
  parameters: {
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
