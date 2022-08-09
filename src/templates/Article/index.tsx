import { graphql, PageProps } from 'gatsby';
import React from 'react';
import ArticleLayout from '^/layouts/Article';
import type { FC } from 'react';

export const PAGE_QUERY = graphql`
  query ArticleTemplate($filePath: String!) {
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
    markdownRemark(fields: { filePath: { eq: $filePath } }) {
      html
      frontmatter {
        createdAt(formatString: "YYYY.MM.DD")
        title
        description
        emoji
        category
        handle
      }
    }
  }
`;

const ArticleTemplate: FC<PageProps<GatsbyTypes.ArticleTemplateQuery>> = ({
  data,
  pageContext,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.siteTitle as string;
  const copyright = data.site?.siteMetadata?.copyright as string;
  const article = {
    handle: data.markdownRemark?.frontmatter?.handle || '#',
    title: data.markdownRemark?.frontmatter?.title || '無題',
    description: data.markdownRemark?.frontmatter?.description as
      | string
      | undefined,
    emoji: data.markdownRemark?.frontmatter?.emoji || '',
    category: data.markdownRemark?.frontmatter?.category || '',
    createdAt: data.markdownRemark?.frontmatter?.createdAt || '',
    html: data.markdownRemark?.html || '',
  };
  return (
    <ArticleLayout
      siteTitle={siteTitle}
      location={location}
      copyright={copyright}
      article={article}
    />
  );
};

export default ArticleTemplate;
