import * as React from "react";
import { Link } from "gatsby";
import { ContentLayout } from "../../atoms";
import svgLogo from "../../../svg/logo.svg";
import { HeaderTag, HeaderInner } from "./styles";

const Header = ({ title, location }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const HeadingLevel = location.pathname === rootPath ? "h1" : "h3";
  return (
    <HeaderTag>
      <ContentLayout>
        <HeaderInner>
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
        </HeaderInner>
      </ContentLayout>
    </HeaderTag>
  );
};

export default Header;
