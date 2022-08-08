import React from 'react';
import { ArticleCard } from '^/cards';
import type { FC } from 'react';

export const ArticleCards: FC<{ articles: Pick<Article, 'title'>[] }> = ({
  articles,
}) => (
  <>
    {articles.map((article) => (
      <ArticleCard
        key={article.title}
        article={article}
        className='w-80 snap-start'
      />
    ))}
  </>
);
