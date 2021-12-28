import * as React from "react";
import ContentWrapper from "../../contentWrapper";
import { FooterContent, FooterInner } from "./styles";

const Footer = () => {
  return (
    <FooterContent>
      <ContentWrapper>
        <FooterInner>
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
        </FooterInner>
      </ContentWrapper>
    </FooterContent>
  );
};

export default Footer;
