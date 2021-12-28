import * as React from "react";
import { ContentLayout } from "_/atoms";
import * as styles from "./styles";

const Footer = () => {
  return (
    <footer css={styles.root()}>
      <ContentLayout>
        <div css={styles.inner()}>
          <div>
            <a
              href="https://github.com/ktnkk/blog"
              target="_blank"
              rel="noopener noreferrer"
            >
              SourceCode
            </a>
          </div>
          <div>© {new Date().getFullYear()}, ktnkk.log</div>
        </div>
      </ContentLayout>
    </footer>
  );
};

export default Footer;
