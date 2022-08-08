import clsx from 'clsx';
import { Link } from 'gatsby';
import React from 'react';
import twemoji from 'twemoji';
import { Text } from '^/elements';
import type { FC } from 'react';

type ArticleCardProps = {
  article: Pick<Article, 'handle' | 'title' | 'emoji' | 'createdAt'>;
  className?: string;
  onClick?: () => void;
};

export const ArticleCard: FC<ArticleCardProps> = ({
  article,
  className,
  onClick,
}) => {
  const { handle, title, emoji, createdAt } = article;
  const styles = clsx('grid gap-6', className);
  const parsedEmoji = twemoji.parse(emoji || '', {
    folder: 'svg',
    ext: '.svg',
  });

  return (
    <Link onClick={onClick} to={`/${handle}`}>
      <div className={styles}>
        <div className='card-image aspect-[1/1] bg-primary/5' />
        <div className='grid gap-1'>
          <Text
            className='w-full overflow-hidden text-ellipsis whitespace-nowrap '
            as='h3'
          >
            {title}
          </Text>
          <div className='flex gap-4'>
            <Text className='flex gap-4'>{createdAt}</Text>
            <p>{emoji}</p>
            <p
              dangerouslySetInnerHTML={{ __html: parsedEmoji }}
              className='w-8'
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
