import { graphql, PageProps } from 'gatsby';
import React from 'react';
import { NewLayout } from '^/layouts';
import type { FC } from 'react';

export const PAGE_QUERY = graphql`
  query NewTemplate($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
    site {
      siteMetadata {
        siteTitle
        copyright
        category {
          name
          handle
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
            filePath
          }
          frontmatter {
            createdAt(formatString: "YYYY.MM.DD")
            title
            emoji
            category
            handle
          }
        }
      }
    }
  }
`;

const NewTemplate: FC<PageProps<GatsbyTypes.NewTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => {
  const { numberOfPages, currentPage, hasPrevPage, hasNextPage } =
    pageContext as CategoryContext;
  const siteTitle = data.site?.siteMetadata?.siteTitle as string;
  const copyright = data.site.siteMetadata?.copyright as string;
  const articles = data.allMarkdownRemark.edges.map((edge) => ({
    handle: edge?.node?.frontmatter?.handle || '#',
    title: edge?.node?.frontmatter?.title || '無題',
    emoji: edge?.node?.frontmatter?.emoji || '', // FIXME
    createdAt: edge?.node?.frontmatter?.createdAt || '',
  }));
  return (
    <NewLayout
      siteTitle={siteTitle}
      location={location}
      copyright={copyright}
      articles={articles}
    />
  );
};

export default NewTemplate;
