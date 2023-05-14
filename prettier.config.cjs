/** @typedef { import('@ianvs/prettier-plugin-sort-imports').PluginConfig } SortImportsConfig */
/** @typedef { import('prettier').Config } PrettierConfig */
/** @typedef {{ tailwindConfig: string }} TailwindConfig */

/** @type { SortImportsConfig | PrettierConfig | TailwindConfig } */

const config = {
  jsxSingleQuote: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindConfig: './packages/config/tailwind',
  importOrder: [
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '^(expo(.*)$)|^(expo$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@kkhys/(.*)$',
    '',
    '^#/utils/(.*)$',
    '^#/features/(.*)$',
    '^#/config/(.*)$',
    '^#/ui/(.*)$',
    '^#/styles/(.*)$',
    '^#/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
};

module.exports = config;
