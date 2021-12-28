import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import twemoji from "twemoji";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { CatLabel, ShareButtons } from "../components/molecules";
import PostJsonLd from "../components/jsonLd/postJsonLd";
import { RelatedPosts } from "../components/organisms";

import postSyntaxHighlightStyle from "../styles/postSyntaxHighlight";
import postContentStyle from "../styles/postContent";
import postCustomBlockStyle from "../styles/postCustomBlock";

import "katex/dist/katex.min.css";

const PostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const siteCategory = data.site.siteMetadata.categories;
  const { relatedPosts, slug } = pageContext;
  const { title, description, date, category, emoji } = post.frontmatter;
  const pageSlug = post.frontmatter.slug;
  const categoryObject = siteCategory.find((cat) => {
    return cat.slug === category;
  });
  const categoryName = categoryObject ? categoryObject.name : slug;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={title} description={description || post.excerpt} />
      <Helmet>
        <link rel="canonical" href={`https://ktnkk.com${location.pathname}`} />
      </Helmet>
      <PostJsonLd
        title={title}
        description={description || post.excerpt}
        date={date}
        url={location.href}
        categorySlug={category}
      />
      <Content>
        <HeroImage
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(emoji || "🐙", {
              folder: "svg",
              ext: ".svg",
            }),
          }}
        />
        <ContentMain>
          <PostDate>{date}</PostDate>
          <PostTitle>{title}</PostTitle>
          <CatLabel slug={category} isLink="true" />
          <PostContent dangerouslySetInnerHTML={{ __html: post.html }} />
          <ShareButtons
            slug={slug}
            title={title}
            emoji={emoji}
            category={categoryName}
            pageSlug={pageSlug}
          />
        </ContentMain>
        <aside>
          <RelatedPosts posts={relatedPosts} />
        </aside>
      </Content>
    </Layout>
  );
};

const Content = styled.section`
  position: relative;
  overflow: hidden;
  font-size: 16px;
  border-radius: 15px;
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    margin: 0 -${(props) => props.theme.sideSpace.small};
  }
`;

const HeroImage = styled.p`
  position: relative;
  background: ${(props) => props.theme.colors.blackLight};
  text-align: center;
  background-repeat: repeat;
  background-size: 400px;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;

  .emoji {
    width: 110px;
    height: 110px;
  }

  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    min-height: 190px;
  }
`;

const ContentMain = styled.div`
  padding: 1.8em ${(props) => props.theme.sideSpace.contentLarge};
  background: #0d1117;
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    padding: 30px ${(props) => props.theme.sideSpace.contentSmall};
  }
`;

const PostTitle = styled.h1`
  margin: 0.1em 0 0.3em;
  font-size: 1.8em;
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    font-size: 25px;
  }
  font-weight: 700;
  line-height: 1.5;
`;

const PostDate = styled.time`
  display: block;
  color: ${(props) => props.theme.colors.silver};
  font-size: 0.9em;
  letter-spacing: 0.05em;
`;

const PostContent = styled.div`
  ${postSyntaxHighlightStyle}
  ${postContentStyle}
  ${postCustomBlockStyle}
`;

export default PostTemplate;

export const pageQuery = graphql`
  query PostTemplate($slug: String!) {
    site {
      siteMetadata {
        title
        author
        categories {
          name
          slug
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        description
        date(formatString: "YYYY.MM.DD")
        emoji
        category
        slug
      }
    }
  }
`;
