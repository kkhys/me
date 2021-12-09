"use strict";

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const isPublished =
    process.env.NODE_ENV === "production" ? [true] : [true, false];

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
        filter: { frontmatter: { published: { in: [${isPublished}] } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date(formatString: "YYYY.MM.DD")
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
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allMarkdownRemark.edges;

  let categories = [];
  posts.forEach((post) => {
    if (post.node.frontmatter.category) {
      categories.push(post.node.frontmatter.category);
    }
  });

  categories = new Set(categories);
  const postsPerPage = 8;

  categories.forEach((category) => {
    let categoryPosts = posts.filter((post) => {
      return post.node.frontmatter.category === category;
    });
    const catNumPages = Math.ceil(categoryPosts.length / postsPerPage);
    Array.from({ length: catNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${category}` : `/${category}/${i + 1}`,
        component: path.resolve("src/templates/categories.tsx"),
        context: {
          category,
          isPublished,
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages: catNumPages,
          currentPage: i + 1,
          hasPrevPage: i !== 0,
          hasNextPage: i !== catNumPages - 1,
        },
      });
    });
  });

  let allRelatedPosts = {};
  categories.forEach((category) => {
    let categoryPosts = posts.filter((post) => {
      return post.node.frontmatter.category === category;
    });
    allRelatedPosts[category] = categoryPosts ? categoryPosts.slice(0, 5) : [];
  });

  posts.forEach((post, index) => {
    let relatedPosts = allRelatedPosts[post.node.frontmatter.category];
    relatedPosts = relatedPosts.filter((relatedPost) => {
      return !(relatedPost.node.fields.slug === post.node.fields.slug);
    });

    createPage({
      path: post.node.frontmatter.slug,
      component: path.resolve(`./src/templates/post.tsx`),
      context: {
        slug: post.node.fields.slug,
        relatedPosts,
      },
    });
  });

  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: path.resolve("./src/templates/index.tsx"),
      context: {
        isPublished,
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
