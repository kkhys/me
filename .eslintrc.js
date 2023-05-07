/** @type { import("eslint").Linter.Config } */

const config = {
  root: true,
  extends: ['@kkhys/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  settings: {
    next: {
      rootDir: ['apps/admin', 'apps/web'],
    },
  },
};

module.exports = config;
