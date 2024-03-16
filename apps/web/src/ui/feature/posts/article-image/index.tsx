import type { ImageProps } from 'next/image';
import * as React from 'react';
import Image from 'next/image';

const NextImage = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
}: {
  src: string;
  alt?: string;
  width: number;
  height: number;
  blurDataURL?: string;
}) => (
  <Image
    src={src}
    alt={alt ?? ''}
    width={width}
    height={height}
    sizes='(min-width: 768px) 42rem, 100vw'
    placeholder='blur'
    blurDataURL={blurDataURL}
    quality={90}
    className='w-full rounded-2xl border-[#474747] shadow dark:border dark:shadow-none'
  />
);

export const ArticleImage = ({
  src,
  alt,
  blurDataURL,
  width,
  height,
  title,
}: Pick<ImageProps, 'blurDataURL' | 'title'> & {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}) => {
  if (!title)
    return (
      <div className='select-none'>
        <NextImage src={src!} alt={alt} width={width as number} height={height as number} blurDataURL={blurDataURL} />
      </div>
    );

  return (
    <figure>
      <div className='select-none'>
        <NextImage src={src!} alt={alt} width={width as number} height={height as number} blurDataURL={blurDataURL} />
      </div>
      <figcaption className='text-muted-foreground text-center text-xs'>{title}</figcaption>
    </figure>
  );
};
