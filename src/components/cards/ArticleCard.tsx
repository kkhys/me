import clsx from 'clsx';
import { Link } from 'gatsby';
import React from 'react';
import { Text } from '^/elements';
import type { FC } from 'react';

type ArticleCardProps = {
  article: Pick<Article, 'title'>;
  className?: string;
  onClick?: () => void;
};

export const ArticleCard: FC<ArticleCardProps> = ({
  article,
  className,
  onClick,
}) => {
  const styles = clsx('grid gap-6', className);

  return (
    <Link onClick={onClick} to='/test'>
      <div className={styles}>
        <div className='card-image aspect-[4/5] bg-primary/5'>
          <Text
            as='label'
            size='fine'
            className='absolute top-0 right-0 m-4 text-right text-notice'
          >
            test
          </Text>
          {/* {image && ( */}
          {/*  <Image */}
          {/*    className='fadeIn aspect-[4/5] w-full object-cover' */}
          {/*    widths={[320]} */}
          {/*    sizes='320px' */}
          {/*    loaderOptions={{ */}
          {/*      crop: 'center', */}
          {/*      scale: 2, */}
          {/*      width: 320, */}
          {/*      height: 400, */}
          {/*    }} */}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*    // @ts-ignore Stock type has `src` as optional */}
          {/*    data={image} */}
          {/*    alt={image.altText || `Picture of ${product.title}`} */}
          {/*    loading={loading} */}
          {/*  /> */}
          {/* )} */}
        </div>
        <div className='grid gap-1'>
          <Text
            className='w-full overflow-hidden text-ellipsis whitespace-nowrap '
            as='h3'
          >
            {article.title}
          </Text>
          <div className='flex gap-4'>
            <Text className='flex gap-4'>test2</Text>
          </div>
        </div>
      </div>
    </Link>
  );
};
