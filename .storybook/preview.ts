import type { Preview } from '@storybook/react';
import '../styles/globals.css';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { customViewports } from '#/.storybook/viewPorts';
import { withThemeByDataAttribute } from '@storybook/addon-styling';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      viewports: {
        ...customViewports,
        ...INITIAL_VIEWPORTS, // TODO: customViewports に組み込む
      },
    },
  },
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
    attributeName: 'data-mode',
  }),
];

export default preview;
