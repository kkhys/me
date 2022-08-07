import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: 'ktnkk.me',
    copyright: `CC BY-NC-SA 4.0 ${new Date().getFullYear()}-PRESENT © Keiten Kiki`,
    category: [
      {
        name: 'tech',
        slug: 't',
      },
      {
        name: 'life',
        slug: 'l',
      },
    ],
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
        name: 'blogLife',
        path: path.resolve('contents', 'life', 'articles'),
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
