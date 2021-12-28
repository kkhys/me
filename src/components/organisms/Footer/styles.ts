import styled from "styled-components";

export const FooterContent = styled.footer`
  padding: 0.1em 0;
`;

export const FooterInner = styled.div`
  margin-top: 3em;
  text-align: center;
  padding: 1.5em;
  border-top: solid 1px ${(props) => props.theme.colors.blackLight};
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;

  a {
    color: ${(props) => props.theme.colors.gray};
    text-decoration: underline;
  }
`;
