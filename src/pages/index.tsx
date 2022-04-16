import type React from 'react';
import type { FC } from 'react';
import { css, useTheme } from '@emotion/react';

const underline = (color: string) => css`
  color: ${color};
  text-decoration: underline;
`;

const Heading = () => {
  const theme = useTheme();
  return <h1 css={underline(theme.color.base)}>test</h1>;
};

const Home: FC = () => <Heading />;

export default Home;
