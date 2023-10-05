import type { Config } from 'tailwindcss';

import baseConfig from '@kkhys/tailwind-config';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [require('daisyui')],
  presets: [baseConfig],
  daisyui: {
    themes: ['light', 'dark'],
    logs: false,
  },
} satisfies Config;
