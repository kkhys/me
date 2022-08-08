import React from 'react';
import { ArticleGrid } from '^/article';
import { Text } from '^/elements';
import { Footer, Header } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type HomeLayoutProps = {
  title: string;
  location: WindowLocation;
  copyright: string;
  articles: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>[];
};

const HomeLayout: FC<HomeLayoutProps> = ({
  title,
  location,
  copyright,
  articles,
}) => (
  <div className='flex min-h-screen flex-col'>
    <Header title={title} location={location} />
    <main role='main' className='grow'>
      <Text>test</Text>
      <ArticleGrid articles={articles} />
    </main>
    <Footer copyright={copyright} location={location} />
  </div>
);

export default HomeLayout;
