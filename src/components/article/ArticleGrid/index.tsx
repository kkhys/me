import { Link } from 'gatsby';
import React from 'react';
import { ArticleCard } from '^/cards';
import { Grid } from '^/elements';
import type { FC } from 'react';

export const ArticleGrid: FC<{ articles: Pick<Article, 'title'>[] }> = ({
  articles,
}) => {
  if (!articles) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to='/products'>
          <p className='underline'>Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <Grid layout='articles' items={articles.length}>
      {articles.map((article) => (
        <ArticleCard key={article.title} article={article} />
      ))}
    </Grid>
  );
};
