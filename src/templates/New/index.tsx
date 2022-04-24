import { graphql, PageProps } from 'gatsby';
import type React from 'react';
import type { FC } from 'react';

const NewTemplate: FC<PageProps<GatsbyTypes.NewTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => (
  <div>
    <p>index template</p>
  </div>
);

export default NewTemplate;

export const pageQuery = graphql`
  query NewTemplate($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
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
