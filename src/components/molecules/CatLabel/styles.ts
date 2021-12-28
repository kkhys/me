import styled from "styled-components";

export const Wrapper = styled.div`
  .category-text {
    display: inline;
    padding: 3px 10px;
    line-height: 1.2;
    font-size: 12px;
    border-radius: 2em;
    font-weight: 700;
    border: 1px solid;
    @media screen and (max-width: ${(props) => props.theme.responsive.large}) {
      font-size: 11px;
      padding: 2.5px 6px;
    }
  }
`;
