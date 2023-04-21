import type { StorybookConfig } from '@storybook/nextjs';
import { resolve } from 'path';

const config = {
  stories: ['../features/**/*.mdx', '../features/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '#': resolve(__dirname, '..'),
    };
    return config;
  },
} satisfies StorybookConfig;

export default config;
