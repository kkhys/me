import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig },
}) => {
  setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve('src'),
        _: path.resolve('src/components'),
      },
    },
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions: { createPage },
  reporter: { panicOnBuild },
}) => {
  const isPublished = (env: string | undefined) =>
    env === 'production' ? 'true' : 'true' || 'false';

  const result: { errors?: Error | Error[] | undefined; data?: unknown } =
    await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___createdAt], order: DESC }
        limit: 1000
        filter: { frontmatter: { published: { in: [${isPublished(
          process.env.NODE_ENV,
        )}] } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              createdAt(formatString: "YYYY.MM.DD")
              emoji
              category
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    panicOnBuild(`There was an error loading your blog posts`, result.errors);
  }
};
