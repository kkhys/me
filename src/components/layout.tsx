import * as React from "react";
import { ThemeProvider } from "@emotion/react";
import { Helmet } from "react-helmet";
import theme from "../styles/theme";
import { Footer, Header } from "./organisms";
import { ContentLayout } from "./atoms";
import styled from "@emotion/styled";
import { Global } from "@emotion/react";
import globalStyle from "../styles/global";

const Layout = ({ location, title, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="siteRoot">
        <Header title={title} location={location} />
        <ContentLayout>
          <Content>
            <MainWrapper>
              <main>{children}</main>
            </MainWrapper>
          </Content>
        </ContentLayout>
        <Footer />
        <Global styles={globalStyle} />
      </div>
    </ThemeProvider>
  );
};

const Content = styled.div`
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

const MainWrapper = styled.div`
  width: calc(100% - 290px - 40px); // FIXME
  @media screen and (max-width: 950px) {
    // FIXME
    width: 100%;
  }
`;

export default Layout;
