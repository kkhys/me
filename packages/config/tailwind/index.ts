import type { Config } from 'tailwindcss';
import * as colors from 'tailwindcss/colors';

export default {
  content: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        'gray-1000': 'rgb(17,17,19)',
        'gray-1100': 'rgb(10,10,11)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} satisfies Config;
