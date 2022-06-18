import { graphql, PageProps } from 'gatsby';
import React from 'react';
import { NewLayout } from '@/layouts';
import type { NewPageContext } from '@/types';
import { SEO } from '^/atoms';
import type { FC } from 'react';

const NewTemplate: FC<PageProps<GatsbyTypes.NewTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.siteTitle as string;
  const copyright = data.site?.siteMetadata?.copyright as string;
  const articleObjects = data.allMarkdownRemark.edges.map((article) => ({
    link: (article?.node?.frontmatter?.slug as string) || undefined,
    emoji: (article?.node?.frontmatter?.emoji as string) || undefined,
    title: (article?.node?.frontmatter?.title as string) || undefined,
    createdAt: (article?.node?.frontmatter?.createdAt as string) || undefined,
    category: (article?.node?.frontmatter?.category as string) || undefined,
  }));
  const categoryObjects = data.site?.siteMetadata?.categories?.map(
    (category) => ({
      name: category?.name as string,
      slug: category?.slug as string,
      color: category?.color as string,
    }),
  );
  const { currentPage, hasNextPage, hasPrevPage, numberOfPages } =
    pageContext as NewPageContext;
  const pagePath = (page: number) => (page <= 1 ? '/' : `/${page}/`);
  return (
    <>
      <SEO />
      <NewLayout
        title={siteTitle}
        location={location}
        currentPage={currentPage}
        copyright={copyright}
        articleObjects={articleObjects}
        categoryObjects={categoryObjects}
      />
    </>
  );
};
export default NewTemplate;

export const pageQuery = graphql`
  query NewTemplate($skip: Int!, $limit: Int!, $isPublished: [Boolean]!) {
    site {
      siteMetadata {
        siteTitle
        copyright
        categories {
          name
          slug
          color
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
