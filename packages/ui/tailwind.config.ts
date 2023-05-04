import type { Config } from 'tailwindcss';

import baseConfig from "@kkhys/tailwind-config";

export default {
  content: ['./src/**/*.tsx'],
  prefix: 'ui-',
  // TODO: Storybook の表示が崩れるので一旦無効化
  // corePlugins: {
  //   preflight: false,
  // },
  presets: [baseConfig],
} satisfies Config;
