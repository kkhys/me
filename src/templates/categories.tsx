import * as React from "react";
import { graphql } from "gatsby";
import Layout from "_/layout";
import SEO from "_/seo";
import CategoryJsonLd from "_/jsonLd/categoryJsonLd";
import { CatMenu, Pagination } from "_/molecules";
import { PostCard } from "_/organisms";
import { css } from "@emotion/react";

const CategoryTemplate = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark.edges;
  const categorySlug = pageContext.category;
  const categoryObject = data.site.siteMetadata.categories.find((cat) => {
    return cat.slug === categorySlug;
  });
  const categoryName = categoryObject ? categoryObject.name : categorySlug;
  const { currentPage, hasNextPage, hasPrevPage, numPages } = pageContext;
  const postPagePath = (page) =>
    page <= 1 ? `/${categorySlug}` : `/${categorySlug}/${page}/`;
  return (
    <Layout location={location} title={categoryName}>
      <SEO title={categoryName} />
      <CategoryJsonLd categorySlug={categorySlug} categoryName={categoryName} />
      <CatMenu location={location} currentPage={currentPage} />
      <h1 css={heading()}>{categoryName}</h1>
      {posts.map(({ node }) => {
        return <PostCard key={node.fields.slug} node={node} />;
      })}
      <Pagination
        pagePath={postPagePath}
        numPages={numPages}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </Layout>
  );
};

const heading = () => css`
  margin: 2rem 0 0.5em;
  font-size: 32px;
  color: #c9d1d9;
  font-weight: 700;
  line-height: 44px;
  letter-spacing: 1px;
`;

export default CategoryTemplate;

export const pageQuery = graphql`
  query CategoryTemplate(
    $category: String
    $skip: Int!
    $limit: Int!
    $isPublished: [Boolean]!
  ) {
    site {
      siteMetadata {
        categories {
          name
          slug
          color
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: {
          category: { eq: $category }
          published: { in: $isPublished }
        }
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY.MM.DD")
            title
            emoji
            category
            slug
          }
        }
      }
    }
  }
`;
