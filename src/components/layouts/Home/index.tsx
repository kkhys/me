import React from 'react';
import { Text } from '^/elements';
import { Footer, Header } from '^/global';
import { ArticleCards } from '^/sections';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type HomeLayoutProps = {
  title: string;
  location: WindowLocation;
  copyright: string;
  articles: Pick<Article, 'title'>[];
};

const HomeLayout: FC<HomeLayoutProps> = ({
  title,
  location,
  copyright,
  articles,
}) => (
  <>
    <Header title={title} location={location} />
    <main role='main' className='grow'>
      <Text>test</Text>
      <ArticleCards articles={articles} />
    </main>
    <Footer copyright={copyright} location={location} />
  </>
);

export default HomeLayout;
