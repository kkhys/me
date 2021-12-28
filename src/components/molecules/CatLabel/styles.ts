import { css } from "@emotion/react";

export const root = () => css`
  .category-text {
    display: inline;
    padding: 3px 10px;
    line-height: 1.2;
    font-size: 12px;
    border-radius: 2em;
    font-weight: 700;
    border: 1px solid;
    @media screen and (max-width: 950px) {
      // FIXME
      font-size: 11px;
      padding: 2.5px 6px;
    }
  }
`;
