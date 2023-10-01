import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  refs: {
    web: {
      title: 'Web',
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:6007/' : 'web/',
    },
    admin: {
      title: 'Admin',
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:6008/' : 'admin/',
    },
  },
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
