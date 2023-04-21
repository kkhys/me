import type { StorybookConfig } from '@storybook/react-vite';
import * as process from 'process';

const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  refs: {
    ui: {
      title: 'Ui',
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:6007/' : 'ui/',
    },
    web: {
      title: 'Web',
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:6008/' : 'web/',
    },
    docs: {
      title: 'Docs',
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:6009/' : 'docs/',
    },
  },
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
} satisfies StorybookConfig;

export default config;
