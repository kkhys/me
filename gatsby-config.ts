import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'ktnkk.me',
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
  ],
};

export default config;
