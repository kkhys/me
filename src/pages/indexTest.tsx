import { css, useTheme } from '@emotion/react';
import React from 'react';
import { GlobalLayout } from '@/layouts';
import { Paragraph } from '^/atoms';
import type { FC } from 'react';

const underline = (color: string) => css`
  color: ${color};
  text-decoration: underline;
`;

const Heading = () => {
  const theme = useTheme();
  return <h1 css={underline(theme.color.base)}>test</h1>;
};

const Home: FC = () => (
  <GlobalLayout>
    <Heading />
    <Paragraph />
  </GlobalLayout>
);

export default Home;
