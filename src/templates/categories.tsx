import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/postCard";
import CategoryJsonLd from "../components/json/categoryJsonLd";
import { CatMenu } from "../components/molecules";
import styled from "styled-components";
import Pagination from "../components/pagination";

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
      <Heading>{categoryName}</Heading>
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

const Heading = styled.h1`
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
