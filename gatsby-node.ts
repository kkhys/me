import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';

const POSTS_PER_PAGE = 8;
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

const isPublishedStr = (env?: string) =>
  env === 'production' ? 'true' : 'true, false';

const isPublished = (env?: string) =>
  env === 'production' ? [true] : [true, false];

const categorySet = (
  posts?: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
): Set<string> => {
  const categoryArr: string[] = [];
  posts?.forEach(
    (post) =>
      post.node.frontmatter?.category &&
      categoryArr.push(post.node.frontmatter.category),
  );
  return new Set(categoryArr);
};

const numberOfPages = (posts?: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>) =>
  posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 0;

const categoryArticles = (
  articles?: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  category?: string,
): GatsbyTypes.MarkdownRemarkEdge[] | undefined =>
  articles?.filter(
    (article) => article.node.frontmatter?.category === category,
  );

const sliceRelatedArticles = (
  articles: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  count: number,
) => {
  const articlesObject: {
    [key: string]: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge> | undefined;
  } = {};
  categorySet(articles).forEach((category) => {
    articlesObject[category] = categoryArticles(articles, category)
      ? categoryArticles(articles, category)?.slice(0, count)
      : [];
  });
  return articlesObject;
};

const categoryRelatedArticles = (
  articles: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  article: GatsbyTypes.MarkdownRemarkEdge,
) => {
  let relatedArticles = sliceRelatedArticles(articles, RELATED_POSTS_COUNT)[
    article.node.frontmatter?.category || 'tech'
  ] as ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>;
  relatedArticles = relatedArticles.filter(
    (relatedArticle) =>
      !(relatedArticle.node.fields?.slug === article.node.fields?.slug),
  );
  return relatedArticles;
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
        filter: { frontmatter: { published: { in: [${isPublishedStr(
          process.env.NODE_ENV,
        )}] } } }
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

  if (result.errors)
    panicOnBuild('There was an error loading my blog posts', result.errors);

  const articles = result.data?.allMarkdownRemark.edges;

  categorySet(articles).forEach((category) => {
    Array.from({
      length: numberOfPages(categoryArticles(articles, category)),
    }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${category}` : `/${category}/${i + 1}`,
        component: path.resolve('src', 'templates', 'Category', 'index.tsx'),
        context: {
          category,
          isPublished: isPublished(process.env.NODE_ENV),
          limit: POSTS_PER_PAGE,
          skip: i * POSTS_PER_PAGE,
          numberOfPages: numberOfPages(categoryArticles(articles, category)),
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage:
            i !== numberOfPages(categoryArticles(articles, category)) - 1,
        },
      });
    });
  });

  articles?.forEach((article) => {
    createPage({
      path: article.node.frontmatter?.slug || '',
      component: path.resolve('src', 'templates', 'Article', 'index.tsx'),
      context: {
        slug: article.node.fields?.slug,
        relatedArticles: categoryRelatedArticles(articles, article),
      },
    });

    Array.from({ length: numberOfPages(articles) }).forEach((_, i) => {
      createPage({
        path: i === 0 ? '/' : `/${i + 1}`,
        component: path.resolve('src', 'templates', 'New', 'index.tsx'),
        context: {
          isPublished: isPublished(process.env.NODE_ENV),
          limit: POSTS_PER_PAGE,
          skip: i * POSTS_PER_PAGE,
          numberOfPages: numberOfPages(articles),
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numberOfPages(articles) - 1,
        },
      });
    });
  });
};
