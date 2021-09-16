import React from "react";
import styled from "styled-components";
import svgTwitterWhite from "../svg/socials/twitter.svg";

const Follow = styled.div`
  margin-top: 2em;
  text-align: center;
`;

const FollowLink = styled.a`
  display: inline-flex;
  align-items: center;
  background: #1da1f2;
  color: #c9d1d9;
  padding: 0.5em 1em;
  border-radius: 4px;
  border-radius: 2.5em;
`;

const ShareButtons = () => {
  return (
    <Follow>
      <FollowLink href="https://twitter.com/ktnkk_" rel="nofollow">
        <img src={svgTwitterWhite} alt="Twitter" width={31} height={17} />
        Follow @ktnkk_
      </FollowLink>
    </Follow>
  );
};

export default ShareButtons;
