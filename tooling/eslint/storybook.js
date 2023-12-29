/** @type { import('eslint').Linter.Config } */
const config = {
  extends: ['plugin:storybook/recommended'],
  ignorePatterns: ['storybook-static']
};

module.exports = config;
