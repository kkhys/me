'use client';

import type { ImageProps } from 'next/image';
import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { cn } from '@kkhys/ui';

const NextImage = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
  onClick,
  layoutId,
  className,
}: ImageProps & {
  layoutId?: string;
}) => {
  const MotionImage = motion(Image);

  return (
    <MotionImage
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      sizes='(min-width: 768px) 42rem, 100vw'
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      quality={90}
      className={cn('w-full rounded-2xl border-[#474747] shadow dark:border dark:shadow-none', className)}
      onClick={onClick}
      layoutId={layoutId}
    />
  );
};

export const ImageBlock = ({
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
  const [isOpen, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  if (!src) return null;

  const ZoomImage = () => (
    <div className='select-none'>
      <NextImage
        src={src}
        alt={alt ?? ''}
        width={width as number}
        height={height as number}
        blurDataURL={blurDataURL}
        onClick={() => setOpen(!isOpen)}
        layoutId={src}
        className={cn(!isOpen && 'cursor-zoom-in')}
      />
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className='fixed inset-0 z-20 bg-background/80 backdrop-blur-[2px]'
        >
          <NextImage
            src={src}
            alt={alt ?? ''}
            width={width as number}
            height={height as number}
            priority={true}
            onClick={() => setOpen(!isOpen)}
            layoutId={src}
            className={cn('fixed inset-0 z-30 m-auto w-[1100px]', isOpen ? 'cursor-zoom-out' : 'cursor-zoom-in')}
          />
        </motion.div>
      )}
    </div>
  );

  if (!title) return <ZoomImage />;

  return (
    <figure>
      <ZoomImage />
      <figcaption className='text-center text-xs text-muted-foreground'>{title}</figcaption>
    </figure>
  );
};
