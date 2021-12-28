import { css } from "@emotion/react";

export const root = () => css`
  .post-card-link {
    display: flex;
    align-items: start;
    padding: 1.4em 0;
    color: #c9d1d9;
    border-top: solid 1px #313746; // FIXME
    @media screen and (max-width: 950px) {
      // FIXME
      padding: 1em 0;
    }
  }
`;
export const emoji = () => css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 90px;
  height: 90px;
  background: #313746; // FIXME
  border-radius: 12px;
  font-size: 50px;
  img {
    width: 45px;
    height: 45px;
  }
  @media screen and (max-width: 950px) {
    // FIXME
    width: 70px;
    height: 70px;
    img {
      width: 38px;
      height: 38px;
    }
  }
`;

export const content = () => css`
  width: calc(100% - 90px);
  padding-left: 20px;
  h3 {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.4;
  }
  time {
    display: block;
    margin-bottom: 0.2em;
    letter-spacing: 0.05em;
    font-size: 0.9em;
    color: #727d86; // FIXME
  }
  @media screen and (max-width: 950px) {
    // FIXME
    width: calc(100% - 70px);
    padding-left: 15px;
    h3 {
      font-size: 16.5px;
    }
    time {
      font-size: 12px;
    }
  }
`;
