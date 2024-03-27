import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

import baseConfig from '@kkhys/tailwind-config';

export default {
  // I need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, '../../packages/ui/**/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-newsreader)', ...defaultTheme.fontFamily.serif],
        mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
        emoji: ['var(--font-noto-emoji)', 'Apple Color Emoji'],
      },
    },
  },
} satisfies Config;
