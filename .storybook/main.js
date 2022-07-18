const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-gatsby',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    config.module.rules[0].exclude = [/core-js/];
    config.module.rules[0].use[0].options.plugins.push(
      require.resolve('babel-plugin-remove-graphql-queries'),
    );
    config.resolve.mainFields = ['browser', 'module', 'main'];
    config.resolve.alias = {
      '@': path.resolve(__dirname, '..', 'src'),
      '^': path.resolve(__dirname, '..', 'src', 'components'),
    };
    return config;
  },
};
