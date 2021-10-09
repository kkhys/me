import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/postCard";
import CategoryMenu from "../components/categoryMenu";
import HomeJsonLd from "../components/json/homeJsonLd";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="" />
      <Helmet>
        <link rel="canonical" href="https://ktnkk.com" />
      </Helmet>
      <HomeJsonLd />
      <CategoryMenu location={location} />
      <PostsContainer>
        {posts.map(({ node }) => {
          return <PostCard key={node.fields.slug} node={node} />;
        })}
      </PostsContainer>
    </Layout>
  );
};

const PostsContainer = styled.div`
  margin-top: 1.5rem;
`;

export default BlogIndex;

export const pageQuery = graphql`
  query BlogIndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
