/** @type { import("eslint").Linter.Config } */

const config = {
  root: true,
  extends: ['@kkhys/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: '.', // FIXME:  __dirname がエラーになるので修正が必要
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  settings: {
    next: {
      rootDir: ['apps/admin', 'apps/web'],
    },
  },
};

module.exports = config;
