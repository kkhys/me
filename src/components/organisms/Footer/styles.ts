import { css } from "@emotion/react";

export const root = () => css`
  padding: 0.1em 0;
`;

export const inner = () => css`
  margin-top: 3em;
  text-align: center;
  padding: 1.5em;
  border-top: solid 1px #313746; // FIXME
  color: #727d86; // FIXME
  font-size: 14px;
  a {
    color: #727d86; // FIXME
    text-decoration: underline;
  }
`;
