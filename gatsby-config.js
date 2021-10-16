module.exports = {
  siteMetadata: {
    title: `ktnkk.log`,
    author: `Keiten Kiki`,
    description: ``,
    siteUrl: `https://ktnkk.com`,
    social: {
      twitter: `ktnkk_`
    },
    categories: [
      {
        name: "Fashion",
        slug: "f",
        color: "#ffbb5c",
        borderColor: "#745a35",
        background: "393024"
      },
      {
        name: "Life",
        slug: "l",
        color: "#ffe085",
        borderColor: "#746b46",
        background: "39372b"
      },
      {
        name: "Onsen",
        slug: "o",
        color: "#80d2ff",
        borderColor: "#3e647a",
        background: "#223441"
      },
      {
        name: "Tech",
        slug: "t",
        color: "#a1e3b5",
        borderColor: "#4c6c5b",
        background: "#283734"
      }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-katex`,
          `gatsby-remark-graphviz`,
          `gatsby-remark-external-links`,
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 650,
              height: 365
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                s: {
                  classes: "simple",
                  title: "optional"
                },
                i: {
                  classes: "info",
                  title: "optional"
                },
                a: {
                  classes: "alert",
                  title: "optional"
                },
                n: {
                  classes: "notice",
                  title: "optional"
                },
                imgS: {
                  classes: "image-small"
                },
                imgM: {
                  classes: "image-medium"
                }
              }
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              prompt: {
                user: "",
                host: "",
                global: true
              },
              escapeEntities: {}
            }
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ktnkk.log`,
        short_name: `ktnkk.log`,
        start_url: `/`,
        background_color: `#0d1117`,
        theme_color: `#313746`,
        display: `fullscreen`,
        icon: `content/assets/favicon.png`
      }
    },
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: ["G-RWPTJLWZ5B"],
        pluginConfig: {
          head: true
        }
      }
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug
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
            title: "ktnkk.com RSS feed"
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `#60e378`,
        showSpinner: false
      }
    },
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `types/gatsby-types.d.ts`
      }
    }
  ]
};
