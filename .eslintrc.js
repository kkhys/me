/** @type { import("eslint").Linter.Config } */

const config = {
  root: true,
  extends: ['@kkhys/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    // FIXME: エラー修正
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
    ],
  },
  settings: {
    next: {
      rootDir: ['apps/admin', 'apps/web'],
    },
  },
};

module.exports = config;
