import React from 'react';
import { Heading, Prose } from '^/elements';
import { Footer, Header } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type ArticleLayoutProps = {
  siteTitle: string;
  location: WindowLocation;
  copyright: string;
  article: Article;
};

const ArticleLayout: FC<ArticleLayoutProps> = ({
  siteTitle,
  location,
  copyright,
  article,
}) => {
  const { title, html } = article;
  return (
    <div className='flex flex-col'>
      <Header title={siteTitle} location={location} />
      <main role='main' className='container min-h-screen-no-nav grow'>
        <Heading>{title}</Heading>
        <Prose html={html} />
      </main>
      <Footer copyright={copyright} location={location} />
    </div>
  );
};

export default ArticleLayout;
