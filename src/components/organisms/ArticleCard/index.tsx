import React from 'react';
import twemoji from 'twemoji';
import { Anchor } from '^/atoms';
import * as styles from './styles';
import type { FC } from 'react';

const ArticleCard: FC<
  Partial<Record<'link' | 'emoji' | 'title' | 'createdAt', string>>
> = ({ link, emoji, title, createdAt }) => {
  const parsedEmoji = twemoji.parse(emoji || '📝', {
    folder: 'svg',
    ext: '.svg',
  });
  console.log(`title: ${title as string}`);
  const cardTitle = title || '無題';
  return (
    <div css={styles.root()}>
      {link ? (
        <Anchor to={`/${link}`}>
          <p
            dangerouslySetInnerHTML={{ __html: parsedEmoji }}
            css={styles.emoji()}
          />
          <div css={styles.content()}>
            <h3 css={styles.heading()}>{cardTitle}</h3>
            {createdAt && <time css={styles.createdAt()}>{createdAt}</time>}
          </div>
        </Anchor>
      ) : (
        <>
          <p
            dangerouslySetInnerHTML={{ __html: parsedEmoji }}
            css={styles.emoji()}
          />
          <div css={styles.content()}>
            <h3>{title}</h3>
            <time>{createdAt}</time>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleCard;
