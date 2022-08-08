import { Link } from 'gatsby';
import React from 'react';
import { ArticleCard } from '^/cards';
import { Grid, Text } from '^/elements';
import type { FC } from 'react';

export const ArticleGrid: FC<{
  articles: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>[];
}> = ({ articles }) => {
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
    <Grid layout='articles'>
      {articles.map((article) => (
        <ArticleCard key={article.title} article={article} />
      ))}
    </Grid>
  );
};
