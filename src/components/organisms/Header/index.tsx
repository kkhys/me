import * as React from "react";
import { Link } from "gatsby";
import { ContentLayout } from "_/atoms";
import svgLogo from "@/svg/logo.svg";
import * as styles from "./styles";

const Header = ({ title, location }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const HeadingLevel = location.pathname === rootPath ? "h1" : "h3";
  return (
    <header css={styles.root()}>
      <ContentLayout>
        <div css={styles.inner()}>
          <HeadingLevel>
            <Link to="/" className="logo-link">
              <img
                className="logo"
                src={svgLogo}
                alt={title}
                width={165}
                height={37}
              />
            </Link>
          </HeadingLevel>
        </div>
      </ContentLayout>
    </header>
  );
};

export default Header;
