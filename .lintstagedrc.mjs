import path from 'path';

const buildTscCommand = () => 'pnpm tsc --noEmit'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((filename) => path.relative(process.cwd(), filename))
    .join(' --file ')}`;

const buildPrettierCommand = (filenames) =>
  `pnpm prettier --write ${filenames
    .map((filename) => path.relative(process.cwd(), filename))
    .join(' ')}`;

export default {
  '*.{ts,tsx}': [buildTscCommand],
  '*.{cjs,mjs,ts,tsx}': [buildEslintCommand],
  // '*.{cjs,mjs,ts,tsx,json,md,yml}': [buildPrettierCommand]
};
