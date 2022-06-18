import React from 'react';
import { Container } from '^/atoms';
import { CategoryMenu } from '^/molecules';
import { ArticleCard, TheFooter, TheHeader } from '^/organisms';
import * as styles from './styles';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type NewLayoutProps = {
  title: string;
  location: WindowLocation;
  currentPage: number;
  copyright: string;
  articleObjects: Partial<
    Record<'link' | 'emoji' | 'title' | 'createdAt' | 'category', string>
  >[];
  categoryObjects: Record<'name' | 'slug' | 'color', string>[] | undefined;
};

const NewLayout: FC<NewLayoutProps> = ({
  title,
  location,
  currentPage,
  copyright,
  articleObjects,
  categoryObjects,
}) => (
  <>
    <TheHeader title={title} location={location} />
    <Container>
      <section css={styles.container()}>
        <div css={styles.main()}>
          <CategoryMenu location={location} currentPage={currentPage} />
          <div css={styles.articleCards()}>
            {articleObjects.map((article) => (
              <ArticleCard
                key={article.link}
                link={article.link}
                emoji={article.emoji}
                title={article.title}
                createdAt={article.createdAt}
                category={article.category}
                categoryObjects={categoryObjects}
              />
            ))}
          </div>
        </div>
      </section>
    </Container>
    <TheFooter copyright={copyright} />
  </>
);

export default NewLayout;
