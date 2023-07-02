'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';

import { InnerContainer, OuterContainer } from '#/ui';

const navigationItem = [
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Blog',
    href: '/posts',
  },
] as const;

export const Header = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>(
  function Header({ className }, ref) {
    const { scrollY } = useScroll();
    const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
    const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

    return (
      <header className={clsx(className, 'fixed inset-x-0 top-0 z-10')}>
        <OuterContainer>
          <motion.div
            ref={ref}
            className='h-14 border-b border-gray-100 bg-white/[var(--bg-opacity-light)] backdrop-blur-sm dark:border-gray-700/40 dark:bg-gray-1000/[var(--bg-opacity-dark)] dark:backdrop-blur'
            style={
              {
                '--bg-opacity-light': bgOpacityLight,
                '--bg-opacity-dark': bgOpacityDark,
              } as unknown as MotionStyle
            }
          >
            <InnerContainer>
              <div className='flex items-center justify-between'>
                <p>test</p>
                <p>test2</p>
              </div>
            </InnerContainer>
          </motion.div>
        </OuterContainer>
      </header>
    );
  },
);
