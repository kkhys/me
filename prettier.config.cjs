/** @typedef { import('prettier').Config } PrettierConfig */
/** @typedef {{ tailwindConfig: string }} TailwindConfig */

/** @type { PrettierConfig | TailwindConfig } */

const config = {
  jsxSingleQuote: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './packages/tailwind-config',
};

module.exports = config;
