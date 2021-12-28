import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import Layout from "_/layout";
import SEO from "_/seo";
import { CatMenu, Pagination } from "_/molecules";
import { PostCard } from "_/organisms";
import HomeJsonLd from "_/jsonLd/homeJsonLd";
import { css } from "@emotion/react";

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
      <div css={container()}>
        {posts.map(({ node }) => {
          return <PostCard key={node.fields.slug} node={node} />;
        })}
      </div>
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

const container = () => css`
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
