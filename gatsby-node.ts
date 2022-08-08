import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';

const POST_PER_PAGE = 8;
const RELATED_POSTS_COUNT = 5;

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig },
}) => {
  setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '^': path.resolve('src', 'components'),
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
  const result: {
    errors?: Error | Error[];
    data?: { allMarkdownRemark: GatsbyTypes.Query['allMarkdownRemark'] };
  } = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___createdAt], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              createdAt(formatString: "YYYY.MM.DD")
              category
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    panicOnBuild('There was an error loading my blog posts', result.errors);
  }

  const articles = result.data?.allMarkdownRemark.edges;
  const categoryArr: string[] = [];

  articles?.forEach(
    (edge) =>
      edge.node.frontmatter?.category &&
      categoryArr.push(edge.node.frontmatter.category),
  );

  const categorySet = new Set(categoryArr);

  const numberOfPages = (
    edges?: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  ) => (edges ? Math.ceil(edges.length / POST_PER_PAGE) : 0);

  const categoryArticles = (
    category?: string,
  ): GatsbyTypes.MarkdownRemarkEdge[] | undefined =>
    articles?.filter(
      (article) => article.node.frontmatter?.category === category,
    );

  categorySet.forEach((category) => {
    Array.from({
      length: numberOfPages(categoryArticles(category)),
    }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${category}` : `/${category}/${i + 1}`,
        component: path.resolve('src', 'templates', 'Category', 'index.tsx'),
        context: {
          category,
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numberOfPages: numberOfPages(categoryArticles(category)),
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numberOfPages(categoryArticles(category)) - 1,
        },
      });
    });
  });

  articles?.forEach((article) => {
    const articlesObject: {
      [key: string]: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge> | undefined;
    } = {};
    categorySet.forEach((category) => {
      articlesObject[category] = categoryArticles(category)
        ? categoryArticles(category)?.slice(0, RELATED_POSTS_COUNT)
        : [];
    });

    let relatedArticles = articlesObject[
      article.node.frontmatter?.category || 'life'
    ] as ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>;
    relatedArticles = relatedArticles.filter(
      (relatedArticle) =>
        !(relatedArticle.node.fields?.slug === article.node.fields?.slug),
    );

    createPage({
      path: article.node.frontmatter?.slug || '',
      component: path.resolve('src', 'templates', 'Article', 'index.tsx'),
      context: {
        slug: article.node.fields?.slug,
        relatedArticles,
      },
    });

    Array.from({ length: numberOfPages(articles) }).forEach((_, i) => {
      createPage({
        path: i === 0 ? '/' : `/${i + 1}`,
        component: path.resolve('src', 'templates', 'Home', 'index.tsx'),
        context: {
          isPublished: [true, false],
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numberOfPages: numberOfPages(articles),
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numberOfPages(articles) - 1,
        },
      });
    });
  });
};
