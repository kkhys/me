import React from "react";
import styled from "styled-components";
import svgTwitterWhite from "../svg/socials/twitter.svg";
import { graphql } from "gatsby";

const Wrapper = styled.div`
  margin: 1.8rem 0 0;
  padding: 0 ${props => props.theme.sideSpace.contentLarge};
  text-align: center;
  color: #c9d1d9;
  @media screen and (max-width: ${props => props.theme.responsive.small}) {
    padding: 0 ${props => props.theme.sideSpace.contentSmall};
  }
`;

const ShareTitle = styled.div`
  font-weight: 700;
  font-size: 1.2em;
  letter-spacing: 0.05em;
`;

const ShareLinks = styled.div`
  margin-top: 0.5em;
`;

const ShareLink = styled.a`
  display: inline-block;
  margin: 0 6px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  color: #c9d1d9;
  background: ${props => props.theme.colors.blackLight};
  font-weight: 700;
  vertical-align: middle;

  &:hover {
    transform: translateY(-2px);
  }
`;
const GitHubLink = styled.a`
  display: inline-block;
  margin-top: 1em;
  font-size: 0.85em;
  color: ${props => props.theme.colors.silver};
`;

const ShareButtons = ({ slug, title, emoji, category }) => {
  const encodedTitle = encodeURIComponent(`${emoji || "🦇"}${title} | ktnkk.log`);
  const pageUrl = `https://ktnkk.com${slug}`;
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
            src={svgTwitterWhite}
            alt="Twitter"
            style={{
              width: "24px",
              height: "19px",
              marginTop: "11px"
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
