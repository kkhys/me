import * as React from "react";
import { Link } from "gatsby";
import twemoji from "twemoji";
import { CatLabel } from "../../molecules";
import { PostCardWrapper, PostCardContent, PostCardEmoji } from "./styles";

const PostCard = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;
  const emoji = twemoji.parse(node.frontmatter.emoji || "🐙", {
    folder: "svg",
    ext: ".svg",
  });

  return (
    <PostCardWrapper>
      <Link to={`/` + node.frontmatter.slug} className="post-card-link">
        <PostCardEmoji dangerouslySetInnerHTML={{ __html: emoji }} />
        <PostCardContent>
          <h3>{title}</h3>
          <time>{node.frontmatter.date}</time>
          <CatLabel slug={node.frontmatter.category} />
        </PostCardContent>
      </Link>
    </PostCardWrapper>
  );
};

export default PostCard;
