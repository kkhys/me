import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';
import { mergeConfig } from 'vite';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '#': resolve(__dirname, '..', 'src'),
    };
    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
    });
  },
} satisfies StorybookConfig;

export default config;
