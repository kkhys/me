import { graphql, PageProps } from 'gatsby';
import type React from 'react';
import type { FC } from 'react';

const IndexTemplate: FC<PageProps<GatsbyTypes.IndexTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => (
  <div>
    <p>index template</p>
  </div>
);

export default IndexTemplate;

export const pageQuery = graphql`
  query IndexTemplate($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
    site {
      siteMetadata {
        title
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
            createdAt
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
