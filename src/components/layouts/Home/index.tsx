import React from 'react';
import { ArticleGrid } from '^/article';
import { Section } from '^/elements';
import { Footer, Header } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type HomeLayoutProps = {
  siteTitle: string;
  location: WindowLocation;
  copyright: string;
  articles: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>[];
};

const HomeLayout: FC<HomeLayoutProps> = ({
  siteTitle,
  location,
  copyright,
  articles,
}) => (
  <div className='flex flex-col'>
    <Header title={siteTitle} location={location} />
    <main role='main' className='container min-h-screen-no-nav grow'>
      <Section>
        <ArticleGrid articles={articles} />
      </Section>
    </main>
    <Footer copyright={copyright} location={location} />
  </div>
);

export default HomeLayout;
