import { graphql, PageProps } from 'gatsby';
import React from 'react';
import { HomeLayout } from '^/layouts';
import type { FC } from 'react';

export const PAGE_QUERY = graphql`
  query HomeTemplate($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
    site {
      siteMetadata {
        siteTitle
        copyright
        category {
          name
          slug
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___createdAt], order: DESC }
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
            createdAt(formatString: "YYYY.MM.DD")
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

const HomeTemplate: FC<PageProps<GatsbyTypes.HomeTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.siteTitle as string;
  const copyright = data.site?.siteMetadata?.copyright as string;
  return (
    <HomeLayout title={siteTitle} location={location} copyright={copyright} />
  );
};

export default HomeTemplate;
