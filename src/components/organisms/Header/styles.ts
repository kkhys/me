import { css } from "@emotion/react";

export const root = () => css`
  padding: 1.4rem 0;
  width: 100%;
`;

export const inner = () => css`
  position: relative;
  h1,
  h3 {
    width: 100%;
  }
  .logo {
    display: block;
    @media screen and (max-width: 500px) {
      // FIXME
      margin: 0 auto;
    }
  }
  .logo-link {
    display: block;
  }
  .message-link {
    position: absolute;
    right: 0;
    top: 7px;
    display: block;
    width: 34px;
    &:hover {
      top: 5px;
    }
  }
`;
