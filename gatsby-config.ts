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
    monetization: '$ilp.uphold.com/xbx8JNwbeF4F',
    social: {
      twitter: 'cp7rdr7zff6ttq',
      github: 'ktnkk',
      instagram: 'q97ba8j5ebz9xsr6vmfqh4tp7yuf58',
    },
    categories: [
      {
        name: 'life',
        slug: 'life',
        color: '#ffe085',
      },
      {
        name: 'tech',
        slug: 'tech',
        color: '#a1e3b5',
      },
    ],
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
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: path.resolve('src', 'types', 'gatsby-types.d.ts'),
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://ktnkk.me',
      },
    },
  ],
};

export default config;
