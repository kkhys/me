import * as React from "react";
import { Link } from "gatsby";
import twemoji from "twemoji";
import { CatLabel } from "_/molecules";
import * as styles from "./styles";

const PostCard = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;
  const emoji = twemoji.parse(node.frontmatter.emoji || "🐙", {
    folder: "svg",
    ext: ".svg",
  });
  return (
    <div css={styles.root()}>
      <Link to={`/` + node.frontmatter.slug} className="post-card-link">
        <p css={styles.emoji()} dangerouslySetInnerHTML={{ __html: emoji }} />
        <div css={styles.content()}>
          <h3>{title}</h3>
          <time>{node.frontmatter.date}</time>
          <CatLabel slug={node.frontmatter.category} />
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
