import * as React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import twemoji from "twemoji";
import Layout from "_/layout";
import SEO from "_/seo";
import { CatLabel, ShareButtons } from "_/molecules";
import PostJsonLd from "_/jsonLd/postJsonLd";
import { RelatedPosts } from "_/organisms";
import postSyntaxHighlightStyle from "@/styles/postSyntaxHighlight";
import postContentStyle from "@/styles/postContent";
import postCustomBlockStyle from "@/styles/postCustomBlock";
import "katex/dist/katex.min.css";
import { css } from "@emotion/react";

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
      <section css={content()}>
        <p
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(emoji || "🐙", {
              folder: "svg",
              ext: ".svg",
            }),
          }}
          css={hero()}
        />
        <div css={main()}>
          <time css={postDate()}>{date}</time>
          <h1 css={header()}>{title}</h1>
          <CatLabel slug={category} isLink="true" />
          <div
            css={postContent()}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <ShareButtons
            slug={slug}
            title={title}
            emoji={emoji}
            category={categoryName}
            pageSlug={pageSlug}
          />
        </div>
        <aside>
          <RelatedPosts posts={relatedPosts} />
        </aside>
      </section>
    </Layout>
  );
};

const content = () => css`
  position: relative;
  overflow: hidden;
  font-size: 16px;
  border-radius: 15px;
  @media screen and (max-width: 500px) {
    // FIXME
    margin: 0 -20px; // FIXME
  }
`;

const hero = () => css`
  position: relative;
  background: #313746; // FIXME
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
  @media screen and (max-width: 500px) {
    // FIXME
    min-height: 190px;
  }
`;

const main = () => css`
  padding: 1.8em 2.5em; // FIXME
  background: #0d1117;
  @media screen and (max-width: 500px) {
    // FIXME
    padding: 30px 20px; // FIXME
  }
`;

const header = () => css`
  margin: 0.1em 0 0.3em;
  font-size: 1.8em;
  @media screen and (max-width: 500px) {
    // FIXME
    font-size: 25px;
  }
  font-weight: 700;
  line-height: 1.5;
`;

const postDate = () => css`
  display: block;
  color: #969fa7; // FIXME
  font-size: 0.9em;
  letter-spacing: 0.05em;
`;

const postContent = () => css`
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
