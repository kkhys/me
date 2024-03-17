import { dirname, join } from 'path';
import { StorybookConfig } from '@storybook/react-vite';

const getAbsolutePath = (value: string): any => dirname(require.resolve(join(value, 'package.json')));

const config = {
  stories: ['../src/**/overview.mdx', '../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    builder: getAbsolutePath('@storybook/builder-vite'),
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
} satisfies StorybookConfig;

export default config;
