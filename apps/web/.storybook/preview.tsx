import type { Preview } from '@storybook/react';

import '#/styles/globals.css';

// import { ThemeProvider } from '#/lib/nextjs/theme-provider';
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
  // decorators: [
  //   (Story, context) => (
  //     <ThemeProvider forcedTheme={context.globals.theme} attribute='class' enableSystem disableTransitionOnChange>
  //       <Story />
  //     </ThemeProvider>
  //   ),
  // ],
} satisfies Preview;

export default preview;
