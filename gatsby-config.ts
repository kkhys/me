import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: path.resolve('src', 'types', 'gatsby-types.d.ts'),
      },
    },
  ],
};

export default config;
