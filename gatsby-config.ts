import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: 'ktnkk.log',
    siteUrl: 'https://ktnkk.me/',
    siteDescription: '',
    author: 'Keiten Kiki',
    copyright: `CC BY-NC-SA 4.0 ${new Date().getFullYear()}-PRESENT © Keiten Kiki`,
    image: '',
    social: {
      twitter: '@cp7rdr7zff6ttq',
      github: 'ktnkk',
    },
  },
  plugins: [
    'gatsby-plugin-emotion',
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
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: path.resolve('src', 'types', 'gatsby-types.d.ts'),
      },
    },
  ],
};

export default config;
