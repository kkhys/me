import * as React from "react";
import { graphql, Link } from "gatsby";

import Layout from "_/layout";
import SEO from "_/seo";

import svg404 from "@/svg/others/404.svg";
import { css } from "@emotion/react";

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <div css={root()}>
        <SEO title="ページが見つかりません" />
        <img css={img()} src={svg404} alt="Not found" />
        <div css={title()}>Not Found</div>
        <Link css={link()} to="/" className="cat-item__link">
          HOME
        </Link>
      </div>
    </Layout>
  );
};

const root = () => css`
  color: #fff;
  text-align: center;
  @media screen and (max-width: 500px) {
    // FIXME
    margin-top: 2em;
  }
`;

const img = () => css`
  display: block;
  max-width: 300px;
  margin: 0 auto;
`;

const title = () => css`
  font-size: 55px;
  font-weight: 700;
  color: #fff;
`;

const link = () => css`
  margin-top: 0.7em;
  display: inline-block;
  padding: 0.3em 1em;
  background: #fff;
  font-size: 20px;
  font-weight: 700;
  color: #313746;
  border-radius: 4px;
  &:hover {
    background: #58a6ff;
  }
`;

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFoundPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
