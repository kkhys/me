import * as React from "react";
import { ThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";
import GlobalStyle from "../styles/global";
import theme from "../styles/theme";
import { Footer, Header } from "./organisms";
import ContentWrapper from "./contentWrapper";
import styled from "styled-components";

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
        <ContentWrapper>
          <Content>
            <MainWrapper>
              <main>{children}</main>
            </MainWrapper>
          </Content>
        </ContentWrapper>
        <Footer />
        <GlobalStyle />
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
  @media screen and (max-width: ${(props) => props.theme.responsive.large}) {
    display: block;
  }
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    margin-top: 0.5rem;
  }
`;

const MainWrapper = styled.div`
  width: calc(100% - ${(props) => props.theme.sizes.bioWidth} - 40px);
  @media screen and (max-width: ${(props) => props.theme.responsive.large}) {
    width: 100%;
  }
`;

export default Layout;
