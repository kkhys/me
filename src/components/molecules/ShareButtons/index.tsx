import * as React from "react";
// import svgTwitterWhite from "../svg/socials/twitter.svg";
import {
  Wrapper,
  ShareLink,
  ShareLinks,
  ShareTitle,
  GitHubLink,
} from "./styles";

const ShareButtons = ({ slug, title, emoji, category, pageSlug }) => {
  const encodedTitle = encodeURIComponent(
    `${emoji || "🦇"}${title} | ktnkk.log`
  );
  const pageUrl = `https://ktnkk.com/${pageSlug}`;
  const categoryName = category.toLowerCase();
  const submodule = `blog.${categoryName}`;
  const date = slug.replace(`/${categoryName}`, "");
  return (
    <Wrapper>
      <ShareTitle>SHARE</ShareTitle>
      <ShareLinks>
        <ShareLink
          href={`https://twitter.com/share?url=${pageUrl}&text=${encodedTitle}&via=ktnkk_`}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <img
            // src={svgTwitterWhite}
            alt="Twitter"
            style={{
              width: "24px",
              height: "19px",
              marginTop: "11px",
            }}
          />
        </ShareLink>
        <ShareLink
          href={`https://www.facebook.com/share.php?u=${pageUrl}`}
          style={{ fontSize: "20px" }}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          f
        </ShareLink>
        <ShareLink
          href={`https://b.hatena.ne.jp/add?mode=confirm&url=${pageUrl}`}
          style={{ fontSize: "19px" }}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          B!
        </ShareLink>
      </ShareLinks>
      <GitHubLink
        href={`https://github.com/ktnkk/${submodule}/edit/main${date}index.md`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Edit on GitHub
      </GitHubLink>
    </Wrapper>
  );
};

export default ShareButtons;
