import * as React from 'react';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

export const ArticleImage = ({
  src,
  alt,
  blurDataURL,
  width,
  height,
}: Pick<ImageProps, 'blurDataURL'> & {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}) => (
  <Image
    src={src as string | StaticImport}
    alt={alt ?? ''}
    width={width as number}
    height={height as number}
    sizes='(min-width: 768px) 42rem, 100vw'
    placeholder='blur'
    blurDataURL={blurDataURL}
    quality={90}
    className='w-full rounded-2xl'
  />
);
