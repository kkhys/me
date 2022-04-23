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

const isPublished = (env?: string) =>
  env === 'production' ? 'true' : 'true' || 'false';

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

const categoryPosts = (
  posts?: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  category?: string,
): GatsbyTypes.MarkdownRemarkEdge[] | undefined =>
  posts?.filter((post) => post.node.frontmatter?.category === category);

const sliceRelatedPosts = (
  posts: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  count: number,
) => {
  const postObject: {
    [key: string]: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge> | undefined;
  } = {};
  categorySet(posts).forEach((category) => {
    postObject[category] = categoryPosts(posts, category)
      ? categoryPosts(posts, category)?.slice(0, count)
      : [];
  });
  return postObject;
};

const categoryRelatedPosts = (
  posts: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>,
  post: GatsbyTypes.MarkdownRemarkEdge,
) => {
  let relatedPosts = sliceRelatedPosts(posts, RELATED_POSTS_COUNT)[
    post.node.frontmatter?.category || 'tech'
  ] as ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>;
  relatedPosts = relatedPosts.filter(
    (relatedPost) =>
      !(relatedPost.node.fields?.slug === post.node.fields?.slug),
  );
  return relatedPosts;
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

  if (result.errors)
    panicOnBuild('There was an error loading my blog posts', result.errors);

  const posts = result.data?.allMarkdownRemark.edges;

  categorySet(posts).forEach((category) => {
    Array.from({
      length: numberOfPages(categoryPosts(posts, category)),
    }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${category}` : `/${category}/${i + 1}`,
        component: path.resolve('src', 'templates', 'category.tsx'),
        context: {
          category,
          isPublished,
          limit: POSTS_PER_PAGE,
          skip: i * POSTS_PER_PAGE,
          numberOfPages: numberOfPages(categoryPosts(posts, category)),
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numberOfPages(categoryPosts(posts, category)) - 1,
        },
      });
    });
  });

  posts?.forEach((post) => {
    createPage({
      path: post.node.frontmatter?.slug || '',
      component: path.resolve('src', 'templates', 'post.tsx'),
      context: {
        slug: post.node.fields?.slug,
        relatedPosts: categoryRelatedPosts(posts, post),
      },
    });

    Array.from({ length: numberOfPages(posts) }).forEach((_, i) => {
      createPage({
        path: i === 0 ? '/' : `/${i + 1}`,
        component: path.resolve('src', 'templates', 'index.tsx'),
        context: {
          isPublished,
          limit: POSTS_PER_PAGE,
          skip: i * POSTS_PER_PAGE,
          numberOfPages,
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numberOfPages(posts) - 1,
        },
      });
    });
  });
};
