'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';

import { Container, InnerContainer, OuterContainer } from '#/ui';

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
      <header className='fixed inset-x-0 top-0'>
        <OuterContainer>
          <div className='h-14 border-b border-gray-100 dark:border-gray-700/40'>
            <InnerContainer>
              <div className='flex items-center justify-between'>
                <p>test</p>
                <p>test2</p>
              </div>
            </InnerContainer>
          </div>
        </OuterContainer>
      </header>
    );
  },
);
