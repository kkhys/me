import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin: 1.8rem 0 0;
  padding: 0 2.5em; // FIXME
  text-align: center;
  color: #c9d1d9;
  @media screen and (max-width: 500px) {
    // FIXME
    padding: 0 20px; // FIXME
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
  background: #313746; // FIXME
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
  color: #969fa7; // FIXME
`;
