import React from 'react';
import { ArticleGrid } from '^/article';
import { Heading } from '^/elements';
import { Footer, Header } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type CategoryLayoutProps = {
  siteTitle: string;
  location: WindowLocation;
  copyright: string;
  articles: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>[];
  category: string;
};

const CategoryLayout: FC<CategoryLayoutProps> = ({
  siteTitle,
  location,
  copyright,
  articles,
  category,
}) => (
  <div className='flex flex-col'>
    <Header title={siteTitle} location={location} />
    <main role='main' className='container min-h-screen-no-nav grow'>
      <Heading>{category}</Heading>
      <ArticleGrid articles={articles} />
    </main>
    <Footer copyright={copyright} location={location} />
  </div>
);

export default CategoryLayout;
