import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 1.8rem 0 0;
  padding: 0 ${(props) => props.theme.sideSpace.contentLarge};
  text-align: center;
  color: #c9d1d9;
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    padding: 0 ${(props) => props.theme.sideSpace.contentSmall};
  }
`;

export const ShareTitle = styled.div`
  font-weight: 700;
  font-size: 1.2em;
  letter-spacing: 0.05em;
`;

export const ShareLinks = styled.div`
  margin-top: 0.5em;
`;

export const ShareLink = styled.a`
  display: inline-block;
  margin: 0 6px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  color: #c9d1d9;
  background: ${(props) => props.theme.colors.blackLight};
  font-weight: 700;
  vertical-align: middle;

  &:hover {
    transform: translateY(-2px);
  }
`;
export const GitHubLink = styled.a`
  display: inline-block;
  margin-top: 1em;
  font-size: 0.85em;
  color: ${(props) => props.theme.colors.silver};
`;
