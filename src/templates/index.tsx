import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { CatMenu, Pagination } from "../components/molecules";
import { PostCard } from "../components/organisms";
import HomeJsonLd from "../components/jsonLd/homeJsonLd";

const Index = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  const { currentPage, hasNextPage, hasPrevPage, numPages } = pageContext;
  const postPagePath = (page) => (page <= 1 ? `/` : `/${page}/`);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="" />
      <Helmet>
        <link rel="canonical" href="https://ktnkk.com" />
      </Helmet>
      <HomeJsonLd />
      <CatMenu location={location} currentPage={currentPage} />
      <PostsContainer>
        {posts.map(({ node }) => {
          return <PostCard key={node.fields.slug} node={node} />;
        })}
      </PostsContainer>
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

const PostsContainer = styled.div`
  margin-top: 1.5rem;
`;

export default Index;

export const pageQuery = graphql`
  query Index($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { published: { in: $isPublished } } }
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
