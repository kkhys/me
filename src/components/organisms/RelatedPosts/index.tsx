import * as React from "react";
import { Link } from "gatsby";
import twemoji from "twemoji";
import * as styles from "./styles";

const RelatedPostCard = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;
  const emoji = twemoji.parse(node.frontmatter.emoji || "🐱", {
    folder: "svg",
    ext: ".svg",
  });
  return (
    <div css={styles.card()}>
      <Link to={`/` + node.frontmatter.slug} className="post-card-link">
        <p css={styles.emoji()} dangerouslySetInnerHTML={{ __html: emoji }} />
        <div css={styles.content()}>
          <h5>{title}</h5>
          <time>{node.frontmatter.date}</time>
        </div>
      </Link>
    </div>
  );
};

const RelatedPosts = ({ posts }) => {
  if (!posts.length) return null;
  let content = [];
  posts.map((post) => {
    content.push(
      <RelatedPostCard key={post.node.fields.slug} node={post.node} />
    );
  });
  return <div css={styles.root}>{content}</div>;
};

export default RelatedPosts;
