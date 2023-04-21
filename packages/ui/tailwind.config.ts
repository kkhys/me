import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.tsx'],
  prefix: 'ui-',
  // TODO: Storybook の表示が崩れるので一旦無効化
  // corePlugins: {
  //   preflight: false,
  // },
  presets: [require('@kkhys/tailwind-config/tailwind.config.ts')],
} satisfies Config;
