import styled from "styled-components";

export const Wrapper = styled.div`
  background: ${(props) => props.theme.colors.whitesmoke};
  padding: 2em ${(props) => props.theme.sideSpace.contentLarge};
  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    padding: 30px ${(props) => props.theme.sideSpace.contentSmall};
  }
`;

export const PostCardWrapper = styled.div`
  .post-card-link {
    display: flex;
    align-items: center;
    margin-bottom: 1.3em;
    padding: 15px;
    background: #0d1117;
    border-radius: 14px;
    color: #c9d1d9;
    border: 1px solid #444c56;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
      padding: 10px;
    }
  }
`;

export const PostCardEmoji = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 80px;
  height: 80px;
  background: ${(props) => props.theme.colors.whitesmoke};
  border-radius: 10px;
  font-size: 50px;

  img {
    width: 45px;
    height: 45px;
  }
`;

export const PostCardContent = styled.div`
  width: calc(100% - 80px);
  padding-left: 15px;

  h5 {
    font-size: 1.1em;
    font-weight: 700;
    line-height: 1.45;
  }

  time {
    display: block;
    margin-bottom: 0.1em;
    letter-spacing: 0.05em;
    font-size: 0.8em;
    color: ${(props) => props.theme.colors.silver};
  }

  @media screen and (max-width: ${(props) => props.theme.responsive.small}) {
    padding-left: 15px;
    h5 {
      font-size: 1em;
    }
  }
`;
