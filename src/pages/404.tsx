import * as React from "react";
import { graphql, Link } from "gatsby";
import styled from "styled-components";

import Layout from "../components/layout";
import SEO from "../components/seo";

import svg404 from "../svg/others/404.svg";

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <Wrapper>
        <SEO title="ページが見つかりません" />
        <HeroImage src={svg404} />
        <Title>Not Found</Title>
        <StyledLink to={`/`} className="cat-item__link">
          HOME
        </StyledLink>
      </Wrapper>
    </Layout>
  );
};

const Wrapper = styled.div`
  color: #fff;
  text-align: center;
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    margin-top: 2em;
  }
`;

const HeroImage = styled.img`
  display: block;
  max-width: 300px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 55px;
  font-weight: 700;
  color: #fff;
`;

const StyledLink = styled(Link)`
  margin-top: 0.7em;
  display: inline-block;
  padding: 0.3em 1em;
  background: #fff;
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.blackLight};
  border-radius: 4px;

  &:hover {
    background: ${(props) => props.theme.colors.highlight};
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
