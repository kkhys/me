import React, { VFC } from "react";
import * as styles from "./styles";

type ContentLayoutProps = {
  children: JSX.Element;
};

const ContentLayout: VFC<ContentLayoutProps> = ({ children }) => {
  return <div css={styles.root()}>{children}</div>;
};

export default ContentLayout;
