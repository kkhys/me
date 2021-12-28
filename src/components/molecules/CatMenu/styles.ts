import { css } from "@emotion/react";

export const nav = () => css`
  display: block;
  margin: 0;
`;

export const list = () => css`
  display: flex;
  @media screen and (max-width: 500px) {
    // FIXME
    margin: 0 -20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
      display: none;
    }
    &:after {
      content: "";
      width: 40px;
      flex: 0 0 auto;
    }
  }
`;

export const item = () => css`
  width: 70px;
  margin: 0 20px 0 0;
  text-align: center;
  @media screen and (max-width: 500px) {
    // FIXME
    width: 60px;
    flex: 0 0 auto;
    margin: 0 0 0 15px;
  }
  .cat-item__img {
    padding: 2px;
    background: #313746; // FIXME
    border-radius: 50%;
    position: relative;
    img {
      position: relative;
      background: #313746; // FIXME
      border-radius: 50%;
      display: block;
      z-index: 2;
    }
  }
  &.active {
    .cat-item__img:after {
      content: "";
      position: absolute;
      display: block;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(
        -225deg,
        #7085b6 0%,
        #87a7d9 50%,
        #def3f8 100%
      ); // FIXME
      animation: rotating 2s linear infinite;
    }
    img {
      border: solid 2px #0d1117; // FIXME
    }
  }
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const link = () => css`
  color: #c9d1d9;
`;

export const name = () => css`
  margin-top: 5px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #727d86; // FIXME
  @media screen and (max-width: 500px) {
    // FIXME
    font-size: 12px;
  }
`;
