import { css } from '@emotion/react';
import React from 'react';
import { Paragraph } from '^/atoms';
import type { FC } from 'react';

const underline = (color: string) => css`
  color: ${color};
  text-decoration: underline;
`;

const Heading = () => <h1 css={underline('red')}>test</h1>;

const Home: FC = () => (
  <>
    <Heading />
    <Paragraph />
  </>
);

export default Home;
