import React from 'react';
import { ArticleGrid } from '^/article';
import { CategoryPagination, CategoryTabs } from '^/category';
import { Section } from '^/elements';
import { Footer, Header, PageHeader } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type NewLayoutProps = {
  siteTitle: string;
  location: WindowLocation;
  copyright: string;
  articles: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>[];
};

const CategoryLayout: FC<NewLayoutProps> = ({
  siteTitle,
  location,
  copyright,
  articles,
}) => (
  <div className='flex flex-col'>
    <Header title={siteTitle} location={location} />
    <main role='main' className='container min-h-screen-no-nav grow'>
      <PageHeader heading='New' />
      <Section>
        <CategoryTabs />
        <ArticleGrid articles={articles} />
        <CategoryPagination />
      </Section>
    </main>
    <Footer copyright={copyright} location={location} />
  </div>
);

export default CategoryLayout;
