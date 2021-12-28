import * as React from "react";
import { Link } from "gatsby";
import twemoji from "twemoji";
import {
  PostCardWrapper,
  PostCardContent,
  PostCardEmoji,
  Wrapper,
} from "./styles";

const RelatedPostCard = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;
  const emoji = twemoji.parse(node.frontmatter.emoji || "🐱", {
    folder: "svg",
    ext: ".svg",
  });

  return (
    <PostCardWrapper>
      <Link to={`/` + node.frontmatter.slug} className="post-card-link">
        <PostCardEmoji dangerouslySetInnerHTML={{ __html: emoji }} />
        <PostCardContent>
          <h5>{title}</h5>
          <time>{node.frontmatter.date}</time>
        </PostCardContent>
      </Link>
    </PostCardWrapper>
  );
};

const RelatedPosts = ({ posts }) => {
  if (!posts.length) return null;
  let content = [];

  posts.forEach((post) => {
    content.push(
      <RelatedPostCard key={post.node.fields.slug} node={post.node} />
    );
  });
  return <Wrapper>{content}</Wrapper>;
};

export default RelatedPosts;
