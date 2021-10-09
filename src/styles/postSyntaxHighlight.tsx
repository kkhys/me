import { css } from "styled-components";

const boxPaddingSide = "1.2em";

const SyntaxHighlightStyle = css`
  .gatsby-highlight {
    margin: 1.5em 0;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      margin: 1.5em -${props => props.theme.sideSpace.contentSmall};
    }
  }

  code[class*="language-"],
  pre[class*="language-"] {
    hyphens: none;
    white-space: pre;
    word-wrap: normal;
    font-family: Menlo, Monaco, "Courier New", monospace;
    font-size: 14.5px;
    color: #22aef1;
    text-shadow: none;
  }

  pre[class*="language-"],
  :not(pre) > code[class*="language-"] {
    background: #22272e;
    border-radius: 5px;
    border: 1px solid #444c56;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      border-radius: 0;
      border: 0;
    }
  }

  pre[class*="language-"] {
    padding: 26px ${boxPaddingSide};
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  pre[class*="language-"] {
    position: relative;
  }

  pre[class*="language-"] code {
    white-space: pre;
    display: block;
  }

  :not(pre) > code[class*="language-"] {
    padding: 0.15em 0.2em 0.05em;
    border-radius: 0.3em;
    border: 0.13em solid #7a6652;
    box-shadow: 1px 1px 0.3em -0.1em #000 inset;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: rgba(255, 255, 255, 0.6);
  }

  .token.operator,
  .token.boolean,
  .token.number {
    color: #a77afe;
  }

  .token.attr-name,
  .token.string {
    color: #ffab3c;
  }

  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #ffab3c;
  }

  .token.selector,
  .token.inserted {
    color: #3eda86;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword,
  .token.important,
  .token.deleted {
    color: #ff7574;
  }

  .token.regex,
  .token.statement {
    color: #22aef1;
  }

  .token.placeholder,
  .token.variable {
    color: #fff;
  }

  .token.important,
  .token.statement,
  .token.bold {
    font-weight: 700;
  }

  .token.punctuation {
    color: #bebec5;
  }

  .token.entity {
    cursor: help;
  }

  .token.italic {
    font-style: italic;
  }

  code.language-markup {
    color: #f9f9f9;
  }

  code.language-markup .token.tag {
    color: #ff7574;
  }

  code.language-markup .token.attr-name {
    color: #3eda86;
  }

  code.language-markup .token.attr-value {
    color: #ffab3c;
  }

  code.language-markup .token.style,
  code.language-markup .token.script {
    color: #22aef1;
  }

  code.language-markup .token.script .token.keyword {
    color: #22aef1;
  }

  /* Line highlight plugin */

  .gatsby-highlight-code-line {
    background-color: rgba(0, 0, 0, 0.3);
    display: table;
    min-width: calc(100% + ${boxPaddingSide} * 2);
    margin-right: -${boxPaddingSide};
    margin-left: -${boxPaddingSide};
    padding-left: 12px;
    border-left: 5px solid #22aef1;
  }

  /*gatsby-remark-code-titles*/

  .gatsby-code-title {
    position: relative;
    margin: 1.5em 0 -24px auto;
    background: #2d333b;
    color: #c9d1d9;
    font-size: 12px;
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    font-weight: 700;
    border-radius: 0 4px;
    display: table;
    z-index: 2;
    border: 1px solid #444c56;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      border-radius: 0;
      margin-right: -${props => props.theme.sideSpace.contentSmall};
      border: 0;
    }
  }

  .gatsby-code-title + .gatsby-highlight {
    margin-top: 0;
  }

  /* Inline code */

  p > code,
  li > code {
    display: inline-block;
    background: #1c4428;
    padding: 0.1em 0.3em;
    margin: 0 0.2em;
    border-radius: 3px;
    line-height: 1.4;
    color: #c9d1d9 !important;
    text-indent: 0;
  }
`;

export default SyntaxHighlightStyle;
