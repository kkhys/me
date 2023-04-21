import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.tsx', './features/**/*.tsx'],
  darkMode: 'class',
  presets: [require('@kkhys/tailwind-config/tailwind.config')], // TODO: @kkhys/tailwind-config で表記できるようにする
} satisfies Config;
