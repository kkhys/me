import { css } from "@emotion/react";

export const root = () => css`
  max-width: 1100px; // FIXME
  margin: 0 auto;
  padding: 0 1.5em; // FIXME
  @media screen and (max-width: 950px) {
    // FIXME
    max-width: 760px;
  }
  @media screen and (max-width: 500px) {
    // FIXME
    padding: 0 20px; // FIXME
  }
`;
