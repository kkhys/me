module.exports = {
  siteMetadata: {
    title: `Kiki blog`,
    author: `Keiten Kiki`,
    description: `秘密のブログ。`,
    siteUrl: `https://ktnkk.com/`,
    social: {
      twitter: `ktnkk_`,
    },
    categories: [
      {
        name: "Fashion",
        slug: "f",
        color: "#e40c6a",
      },
      {
        name: "Life",
        slug: "l",
        color: "#ccf75f",
      },
      {
        name: "Onsen",
        slug: "o",
        color: "#2bdfff",
      },
      {
        name: "Tech",
        slug: "t",
        color: "#79ff2b",
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-code-titles`,
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 650,
              height: 365,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                simple: {
                  classes: "simple",
                  title: "optional",
                },
                info: {
                  classes: "info",
                  title: "optional",
                },
                alert: {
                  classes: "alert",
                  title: "optional",
                },
                notice: {
                  classes: "notice",
                  title: "optional",
                },
                imageSmall: {
                  classes: "image-small",
                },
                imageMedium: {
                  classes: "image-medium",
                },
              },
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kiki blog | 秘密のブログ`,
        short_name: `Kiki blog`,
        start_url: `/`,
        background_color: `rgb(33, 36, 45)`,
        theme_color: `#0ce429`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "",
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-twitter`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    // RSS feed
    // ref: https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-an-rss-feed/
    {
      resolve: `gatsby-plugin-feed`,
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
            serialize: ({query: {site, allMarkdownRemark}}) => {
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
  ],
};
