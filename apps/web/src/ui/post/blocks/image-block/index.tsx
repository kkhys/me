'use client';

import type { ImageProps } from 'next/image';
import * as React from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

import '#/styles/react-medium-image-zoom.css';

import { getGapWidth } from 'react-remove-scroll-bar';

import { useMediaQuery } from '#/hooks';

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

type ModalState = 'LOADED' | 'LOADING' | 'UNLOADED' | 'UNLOADING';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomZoom = ({ img, _modalState, gap }: { img: React.ReactElement | null; _modalState: any; gap: number }) => {
  const modalState = _modalState as ModalState;

  React.useLayoutEffect(() => {
    if (modalState === 'LOADING') {
      document.body.style.setProperty('--removed-body-scroll-bar-size', `${gap}px`);
    }

    if (modalState === 'UNLOADED') {
      document.body.style.removeProperty('--removed-body-scroll-bar-size');
    }
  }, [gap, modalState]);

  return <>{img}</>;
};

const ZoomImage = ({ src, children }: { src: string; children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { gap } = getGapWidth();

  return (
    <Zoom
      zoomImg={{ src }}
      zoomMargin={isDesktop ? 45 : 10}
      ZoomContent={({ img, modalState }) => <CustomZoom img={img} _modalState={modalState} gap={gap} />}
    >
      {children}
    </Zoom>
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
  if (!src) {
    return <p>Failed to load image. alt = {alt}</p>;
  }

  if (!title)
    return (
      <div className='select-none'>
        <ZoomImage src={src}>
          <NextImage src={src} alt={alt} width={width as number} height={height as number} blurDataURL={blurDataURL} />
        </ZoomImage>
      </div>
    );

  return (
    <figure>
      <div className='select-none'>
        <ZoomImage src={src}>
          <NextImage src={src} alt={alt} width={width as number} height={height as number} blurDataURL={blurDataURL} />
        </ZoomImage>
      </div>
      <figcaption className='text-center text-xs text-muted-foreground'>{title}</figcaption>
    </figure>
  );
};
