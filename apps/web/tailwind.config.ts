import type { Config } from 'tailwindcss';

import baseConfig from '@kkhys/tailwind-config';

export default {
  content: ['./app/**/*.tsx', './features/**/ui/*.tsx'],
  darkMode: 'class',
  presets: [baseConfig],
} satisfies Config;
