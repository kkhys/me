import * as React from "react";
import { Link, StaticQuery, graphql } from "gatsby";
import styled from "styled-components";

const categoryLabel = ({ slug, isLink }) => {
  if (!slug) return null;
  return (
    <StaticQuery<GatsbyTypes.CategoryQueryQuery>
      query={categoryQuery}
      render={data => {
        const { categories } = data.site.siteMetadata;
        const categoryObject = categories.find(cat => {
          return cat.slug === slug;
        });
        const categoryName = categoryObject ? categoryObject.name : slug;
        const categoryColor = categoryObject ? categoryObject.color : "#6d4bf5";
        const categoryBorderColor = categoryObject ? categoryObject.borderColor : "#fff";
        const categoryBackground = categoryObject ? categoryObject.background : "#6d4bf5";
        const content = isLink ? (
          <Link
            to={`/${slug}`}
            className="category-text"
            style={{
              color: categoryColor,
              borderColor: categoryBorderColor,
              background: categoryBackground
            }}
          >
            {categoryName}
          </Link>
        ) : (
          <span
            className="category-text"
            style={{
              color: categoryColor,
              borderColor: categoryBorderColor,
              background: categoryBackground
            }}
          >
            {categoryName}
          </span>
        );
        return <Wrapper>{content}</Wrapper>;
      }}
    />
  );
};

const Wrapper = styled.div`
  .category-text {
    display: inline;
    padding: 3px 10px;
    line-height: 1.2;
    font-size: 12px;
    border-radius: 2em;
    font-weight: 700;
    border: 1px solid;
    @media screen and (max-width: ${props => props.theme.responsive.large}) {
      font-size: 11px;
      padding: 2.5px 6px;
    }
  }
`;

export default categoryLabel;

const categoryQuery = graphql`
  query CategoryQuery {
    site {
      siteMetadata {
        categories {
          name
          slug
          color
          borderColor
          background
        }
      }
    }
  }
`;
