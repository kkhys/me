import React from 'react';
import { ArticleGrid } from '^/article';
import { Heading } from '^/elements';
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
  <div className='flex flex-col'>
    <Header title={title} location={location} />
    <main role='main' className='container min-h-screen-no-nav grow'>
      <Heading>test</Heading>
      <ArticleGrid articles={articles} />
    </main>
    <Footer copyright={copyright} location={location} />
  </div>
);

export default HomeLayout;
