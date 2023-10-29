import { dirname, join, resolve } from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const getAbsolutePath = (value: string): any => dirname(require.resolve(join(value, 'package.json')));

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '#': resolve(__dirname, '..'),
    };
    return config;
  },
  core: {
    disableTelemetry: true,
  },
} satisfies StorybookConfig;

export default config;
