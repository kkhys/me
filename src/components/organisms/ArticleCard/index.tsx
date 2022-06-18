import React from 'react';
import twemoji from 'twemoji';
import { Anchor } from '^/atoms';
import { CategoryBadge } from '^/molecules';
import * as styles from './styles';
import type { FC } from 'react';

type ArticleCardProps = {
  link?: string;
  emoji?: string;
  title?: string;
  createdAt?: string;
  category?: string;
  categoryObjects?: Record<'name' | 'slug' | 'color', string>[];
};

const ArticleCard: FC<ArticleCardProps> = ({
  link,
  emoji,
  title,
  createdAt,
  category,
  categoryObjects,
}) => {
  const parsedEmoji = twemoji.parse(emoji || '📝', {
    folder: 'svg',
    ext: '.svg',
  });
  const cardTitle = title || '無題';
  return link ? (
    <Anchor to={`/${link}`} css={styles.root()}>
      <p
        dangerouslySetInnerHTML={{ __html: parsedEmoji }}
        css={styles.emoji()}
      />
      <div css={styles.content()}>
        <h3 css={styles.heading()}>{cardTitle}</h3>
        {createdAt && <time css={styles.createdAt()}>{createdAt}</time>}
        <CategoryBadge slug={category} categoryObjects={categoryObjects} />
      </div>
    </Anchor>
  ) : (
    <div css={styles.root()}>
      <p
        dangerouslySetInnerHTML={{ __html: parsedEmoji }}
        css={styles.emoji()}
      />
      <div css={styles.content()}>
        <h3>{title}</h3>
        <time>{createdAt}</time>
        <CategoryBadge slug={category} categoryObjects={categoryObjects} />
      </div>
    </div>
  );
};

export default ArticleCard;
