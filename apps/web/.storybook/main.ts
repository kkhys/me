import { dirname, join, resolve } from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const getAbsolutePath = (value: string): any =>
  dirname(require.resolve(join(value, 'package.json')));

const config = {
  stories: ['../src/**/overview.mdx', '../src/**/*.stories.@(ts|tsx|mdx)'],
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
      ...config.resolve?.alias,
      '#': resolve(__dirname, '..'),
      // FIXME: I don't know why this is needed, but it is
      // @see: https://github.com/storybookjs/storybook/issues/24234
      'contentlayer/generated':
        'next/dist/shared/lib/router-context.shared-runtime',
    };
    return config;
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
} satisfies StorybookConfig;

export default config;
