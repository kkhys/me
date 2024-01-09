'use client';

import * as React from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';

const MotionImage = motion(Image);

export const GrayscaleTransitionImage = (
  props: Pick<ImageProps, 'src' | 'quality' | 'className' | 'sizes' | 'priority' | 'alt'>,
) => {
  const ref = React.useRef<React.ElementRef<'div'>>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 30%'],
  });
  const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
  const filter = useMotionTemplate`grayscale(${grayscale})`;

  return (
    <div ref={ref} className='group relative'>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      <MotionImage style={{ filter }} {...props} />
      <div
        className='pointer-events-none absolute left-0 top-0 w-full opacity-0 transition duration-300 group-hover:opacity-100'
        aria-hidden='true'
      >
        <Image {...props} />
      </div>
    </div>
  );
};
