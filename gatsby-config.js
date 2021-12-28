"use strict";

const { resolve } = require("path");
module.exports = {
  siteMetadata: {
    title: "ktnkk.log",
    author: "Keiten Kiki",
    description: "",
    siteUrl: "https://ktnkk.com",
    social: {
      twitter: "ktnkk_",
      instagram: "ktnkk_",
    },
    categories: [
      {
        name: "Fashion",
        slug: "f",
        color: "#ffbb5c",
        borderColor: "#745a35",
        background: "393024",
      },
      {
        name: "Life",
        slug: "l",
        color: "#ffe085",
        borderColor: "#746b46",
        background: "#39372b",
      },
      {
        name: "Onsen",
        slug: "o",
        color: "#80d2ff",
        borderColor: "#3e647a",
        background: "#223441",
      },
      {
        name: "Tech",
        slug: "t",
        color: "#a1e3b5",
        borderColor: "#4c6c5b",
        background: "#283734",
      },
    ],
  },
  plugins: [
    "gatsby-plugin-sitemap",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-emotion",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: resolve(__dirname, "content", "blog"),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: resolve(__dirname, "content", "assets"),
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-autolink-headers",
          "gatsby-remark-code-titles",
          "gatsby-remark-katex",
          "gatsby-remark-graphviz",
          "gatsby-remark-external-links",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 700,
              quality: 70,
              linkImagesToOriginal: false,
              withWebp: true,
              withAvif: true,
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              prompt: {
                user: "",
                host: "",
                global: true,
              },
              escapeEntities: {},
            },
          },
          {
            resolve: "gatsby-remark-katex",
            options: {
              strict: "ignore",
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "ktnkk.log",
        short_name: "ktnkk.log",
        start_url: "/",
        background_color: "#0d1117",
        theme_color: "#313746",
        display: "fullscreen",
        icon: resolve(__dirname, "content", "assets", "favicon.png"),
      },
    },
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: ["G-RWPTJLWZ5B"],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: "gatsby-plugin-canonical-urls",
      options: {
        siteUrl: "https://ktnkk.com",
        stripQueryString: true,
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        configFile: "robots-txt.config.js",
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "ktnkk.com RSS feed",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#60e378",
        showSpinner: false,
      },
    },
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `types/gatsby-types.d.ts`,
      },
    },
  ],
};
