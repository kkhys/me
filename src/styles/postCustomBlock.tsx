import { css } from "@emotion/react";

const postCustomBlockStyle = css`
  .custom-block {
    margin: 1em 0;
    background: #2e363f; // FIXME
  }

  .custom-block-heading {
    font-weight: 700;

    .emoji {
      width: 1.2em !important;
      height: 1.2em !important;
      vertical-align: -0.2em !important;
    }
  }

  .custom-block-body {
    font-size: 0.92em;

    & > *:first-child {
      margin-top: 0;
    }

    & > *:last-child {
      margin-bottom: 0;
    }

    h5 {
      font-size: 1.05em;
      margin: 20px 0 5px;
    }
  }

  & > *:first-child {
    margin-top: 0;
  }

  .custom-block.simple {
    padding: 1em 1.2em;
    border-radius: 5px;

    .custom-block-heading {
      font-size: 1.1em;
    }
  }

  .custom-block.info,
  .custom-block.alert,
  .custom-block.notice {
    padding: 0.7em 1em;
    border: solid 1px;
    border-radius: 3px;
  }

  .custom-block.info {
    border-color: #314064;
    background: #10192c;
  }

  .custom-block.alert {
    border-color: #713f50;
    background: #371f2b;

    .custom-block-heading {
      color: #f7615f; // FIXME
    }
  }

  .custom-block.notice {
    border-color: #634711;
    background: #272115;

    .custom-block-heading {
      color: #ffa22b; // FIXME
    }
  }

  .custom-block.image-small,
  .custom-block.image-medium {
    background: #2e363f; // FIXME
    padding: 1.5em;
    text-align: center;
    border-radius: 5px;

    .gatsby-resp-image-wrapper {
      margin: 0;
      border: none;
      box-shadow: 0 5px 15px -5px rgba(40, 50, 70, 0.15);
    }
  }

  .custom-block.image-small .gatsby-resp-image-wrapper {
    max-width: 350px !important;
    border: none;
  }

  .custom-block.image-medium .gatsby-resp-image-wrapper {
    max-width: 450px !important;
    border: none;
  }
`;

export default postCustomBlockStyle;
