import * as React from "react";
import { ContentLayout } from "../../atoms";
import { FooterContent, FooterInner } from "./styles";

const Footer = () => {
  return (
    <FooterContent>
      <ContentLayout>
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
      </ContentLayout>
    </FooterContent>
  );
};

export default Footer;
