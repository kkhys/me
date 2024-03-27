import type { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  refs: (_, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        ui: {
          title: 'UI',
          url: 'http://localhost:6007/',
        },
        web: {
          title: 'Web',
          url: 'http://localhost:6008/',
        },
      };
    }
    return {
      ui: {
        title: 'UI',
        url: 'ui/',
      },
      web: {
        title: 'Web',
        url: 'web/',
      },
    };
  },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
} satisfies StorybookConfig;

export default config;
