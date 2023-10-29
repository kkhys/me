import type { Preview } from '@storybook/react';

import '#/styles/globals.css';

import { androidViewports, ipadViewports, iphoneViewports, tailwindViewports } from './viewports';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
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
