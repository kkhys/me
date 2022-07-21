import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: 'ktnkk.me',
  },
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blogTech',
        path: path.resolve('contents', 'tech', 'articles'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: {
          name: 'blogLife',
          path: path.resolve('contents', 'life', 'articles'),
        },
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          'gatsby-remark-external-links',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: path.resolve('src', 'types', 'gatsby-types.d.ts'),
      },
    },
  ],
};

export default config;
