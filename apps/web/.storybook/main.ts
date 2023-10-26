import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const getAbsolutePath = (value: string): any => dirname(require.resolve(join(value, 'package.json')));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
