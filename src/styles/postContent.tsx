import { css } from "styled-components";

const postContentStyle = css`
  margin: 1.5em 0 1em;
  line-height: 2;

  a:hover {
    text-decoration: underline;
  }

  p {
    margin-bottom: 2em;
    text-indent: 1em;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 40px 0 10px;
    font-weight: 700;
    line-height: 1.5;
  }

  h2 {
    position: relative;
    margin: 55px 0 12px;
    padding: 5px 0 5px 17px;
    font-size: 1.55em;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      display: inline-block;
      width: 5px;
      height: 100%;
      border-radius: 5px;
      background-image: linear-gradient(0deg, #00cdac 0%, #8ddad5 100%);
    }
  }

  h3 {
    margin: 55px 0 12px;
    font-size: 1.45em;
  }

  h4 {
    margin: 55px 0 12px;
    font-size: 1.1em;
  }

  ul,
  ol {
    margin: 2em 0;

    p {
      margin: 0;
    }
  }

  ul {
    padding-left: 1.2em;
  }

  ul li {
    margin: 0.4em 0;
    list-style: disc;
  }

  ul ul {
    margin: 0;
  }

  ol {
    & > li {
      list-style: decimal;
      list-style-position: inside;
      position: relative;
      line-height: 25px;
      margin: 1em 0;
    }
  }

  strong {
    font-weight: 700;
    border-bottom: 1px dashed #f49810;
  }

  em {
    font-style: italic;
  }

  del {
    text-decoration: line-through;
  }

  hr {
    display: block;
    margin: 2em 0;
    border: none;
    border-top: dotted 3px #c9d1d9;
  }

  table {
    display: block;
    border-spacing: 2px;
    border-collapse: separate;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    width: auto;
    font-size: 0.9em;
    line-height: 1.4;

    th {
      background-color: #2d333b;
      color: #c9d1d9;
      padding: 10px 12px;
      text-align: center;
      font-weight: 700;

      &[align="center"] {
        text-align: center;
      }

      &[align="right"] {
        text-align: right;
      }
    }

    td {
      background-color: #22272e;
      color: #c9d1d9;
      padding: 10px 12px;
    }

    thead tr {
      th:first-child {
        border-radius: 5px 0 0 0;
      }

      th:last-child {
        border-radius: 0 5px 0 0;
      }
    }

    tbody tr:last-child {
      td:first-child {
        border-radius: 0 0 0 5px;
      }

      td:last-child {
        border-radius: 0 0 5px 0;
      }
    }
  }

  blockquote {
    margin: 2.3em 0;
    font-style: italic;
    background: ${(props) => props.theme.colors.whitesmoke};
    padding: 1em;

    p {
      margin: 0.3em 0;
    }
  }

  .gatsby-resp-image-wrapper {
    margin: 1em 0;
    border: solid 1px #30363d;
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    overflow: hidden;
  }

  a.anchor {
    fill: #c9d1d9;
  }
`;

export default postContentStyle;
