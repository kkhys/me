const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
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
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  const posts = result.data.allMarkdownRemark.edges;

  let categories = [];
  posts.forEach(post => {
    if (post.node.frontmatter.category) {
      categories.push(post.node.frontmatter.category);
    }
  });
  categories = new Set(categories);
  categories.forEach(category => {
    createPage({
      path: `/${category}/`,
      component: path.resolve("src/templates/categories.js"),
      context: {
        category
      }
    });
  });

  let allRelatedPosts = {};
  categories.forEach(category => {
    let categoryPosts = posts.filter(post => {
      return post.node.frontmatter.category === category;
    });
    allRelatedPosts[category] = categoryPosts ? categoryPosts.slice(0, 5) : [];
  });

  posts.forEach((post, index) => {
    let relatedPosts = allRelatedPosts[post.node.frontmatter.category];
    relatedPosts = relatedPosts.filter(relatedPost => {
      return !(relatedPost.node.fields.slug === post.node.fields.slug);
    });

    createPage({
      path: post.node.frontmatter.slug,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        slug: post.node.fields.slug,
        relatedPosts
      }
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
      value
    });
  }
};
