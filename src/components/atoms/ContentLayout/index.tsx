import * as React from "react";
import { IndexContent } from "./styles";
import { VFC } from "react";

type ContentLayoutProps = {
  children: JSX.Element;
};

const ContentLayout: VFC<ContentLayoutProps> = ({ children }) => {
  return <IndexContent>{children}</IndexContent>;
};

export default ContentLayout;
