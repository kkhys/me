import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/postCard";
import CategoryMenu from "../components/categoryMenu";
import CategoryJsonLd from "../components/json/categoryJsonLd";
import styled from "styled-components";

const CategoryTemplate = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark.edges;
  const categorySlug = pageContext.category;
  const categoryObject = data.site.siteMetadata.categories.find(cat => {
    return cat.slug === categorySlug;
  });
  const categoryName = categoryObject ? categoryObject.name : categorySlug;

  return (
    <Layout location={location} title={categoryName}>
      <SEO title={categoryName} />
      <CategoryJsonLd categorySlug={categorySlug} categoryName={categoryName} />
      <CategoryMenu location={location} />
      <Heading>{categoryName}</Heading>
      {posts.map(({ node }) => {
        return <PostCard key={node.fields.slug} node={node} />;
      })}
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
  query CategoryTemplateQuery($category: String) {
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
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
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
