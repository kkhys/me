import * as React from "react";
import { css, ThemeProvider } from "@emotion/react";
import { Helmet } from "react-helmet";
import theme from "@/styles/theme";
import { Footer, Header } from "_/organisms";
import { ContentLayout } from "_/atoms";
import { Global } from "@emotion/react";
import globalStyle from "@/styles/global";

const Layout = ({ location, title, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <div className="siteRoot">
        <Header title={title} location={location} />
        <ContentLayout>
          <div css={content()}>
            <div css={main()}>
              <main>{children}</main>
            </div>
          </div>
        </ContentLayout>
        <Footer />
        <Global styles={globalStyle} />
      </div>
    </ThemeProvider>
  );
};

const content = () => css`
  margin-top: 1rem;
  display: flex;
  min-height: 85vh;
  align-items: flex-start;
  justify-content: center;
  @media screen and (max-width: 950px) {
    // FIXME
    display: block;
  }
  @media screen and (max-width: 500px) {
    // FIXME
    margin-top: 0.5rem;
  }
`;

const main = () => css`
  width: calc(100% - 290px - 40px); // FIXME
  @media screen and (max-width: 950px) {
    // FIXME
    width: 100%;
  }
`;

export default Layout;
