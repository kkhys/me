import * as React from "react";
import svgTwitterWhite from "@/svg/socials/twitter.svg";
import * as styles from "./styles";

const ShareButtons = ({ slug, title, emoji, category, pageSlug }) => {
  const encodedTitle = encodeURIComponent(
    `${emoji || "🦇"}${title} | ktnkk.log`
  );
  const pageUrl = `https://ktnkk.com/${pageSlug}`;
  const categoryName = category.toLowerCase();
  const submodule = `blog.${categoryName}`;
  const date = slug.replace(`/${categoryName}`, "");
  return (
    <div css={styles.root()}>
      <div css={styles.title()}>SHARE</div>
      <div css={styles.links()}>
        <a
          href={`https://twitter.com/share?url=${pageUrl}&text=${encodedTitle}&via=ktnkk_`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          css={styles.link()}
        >
          <img
            src={svgTwitterWhite}
            alt="Twitter"
            style={{
              width: "24px",
              height: "19px",
              marginTop: "11px",
            }}
          />
        </a>
        <a
          href={`https://www.facebook.com/share.php?u=${pageUrl}`}
          style={{ fontSize: "20px" }}
          target="_blank"
          rel="noopener noreferrer nofollow"
          css={styles.link()}
        >
          f
        </a>
        <a
          href={`https://b.hatena.ne.jp/add?mode=confirm&url=${pageUrl}`}
          style={{ fontSize: "19px" }}
          target="_blank"
          rel="noopener noreferrer nofollow"
          css={styles.link()}
        >
          B!
        </a>
      </div>
      <a
        href={`https://github.com/ktnkk/${submodule}/edit/main${date}index.md`}
        target="_blank"
        rel="noopener noreferrer"
        css={styles.ghLink()}
      >
        Edit on GitHub
      </a>
    </div>
  );
};

export default ShareButtons;
