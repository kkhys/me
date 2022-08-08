import { Link } from 'gatsby';
import React from 'react';
import { ArticleCard } from '^/cards';
import { Grid, Text } from '^/elements';
import type { FC } from 'react';

export const ArticleGrid: FC<{ articles: Pick<Article, 'title'>[] }> = ({
  articles,
}) => {
  if (!articles) {
    return (
      <>
        <Text>No articles found</Text>
        <Link to='/'>
          <Text className='underline'>Back to top</Text>
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
