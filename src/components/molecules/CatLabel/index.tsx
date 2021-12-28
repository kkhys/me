import * as React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import * as styles from "./styles";

const CategoryLabel = ({ slug, isLink = false }) => {
  if (!slug) return null;
  const { site } = useStaticQuery<GatsbyTypes.CategoryLabelQuery>(
    graphql`
      query CategoryLabel {
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
    `
  );

  const { categories } = site.siteMetadata;
  const categoryObject = categories.find((cat) => {
    return cat.slug === slug;
  });
  const categoryName = categoryObject ? categoryObject.name : slug;
  const categoryColor = categoryObject ? categoryObject.color : "#6d4bf5";
  const categoryBorderColor = categoryObject
    ? categoryObject.borderColor
    : "#fff";
  const categoryBackground = categoryObject
    ? categoryObject.background
    : "#6d4bf5";
  const content = isLink ? (
    <Link
      to={`/${slug}`}
      className="category-text"
      style={{
        color: categoryColor,
        borderColor: categoryBorderColor,
        background: categoryBackground,
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
        background: categoryBackground,
      }}
    >
      {categoryName}
    </span>
  );

  return <div css={styles.root}>{content}</div>;
};

export default CategoryLabel;
