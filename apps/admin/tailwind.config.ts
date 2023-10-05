import type { Config } from 'tailwindcss';

import baseConfig from '@kkhys/tailwind-config';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [require('daisyui')],
  presets: [baseConfig],
} satisfies Config;
