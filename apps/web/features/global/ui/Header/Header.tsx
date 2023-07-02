'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import clsx from 'clsx';
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';

import avatarImage from '#/assets/avatar.jpg';
import { InnerContainer, OuterContainer } from '#/ui';

// const navigationItem = [
//   {
//     title: 'About',
//     href: '/about',
//   },
//   {
//     title: 'Blog',
//     href: '/posts',
//   },
// ] as const;

const AvatarContainer = ({
  className,
  ...props
}: { className?: string } & JSX.IntrinsicElements['div']) => {
  return (
    <div
      className={clsx(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 backdrop-blur dark:bg-gray-800/90 dark:ring-white/10',
      )}
      {...props}
    />
  );
};

const Avatar = ({
  large = false,
  className,
  ...props
}: {
  large?: boolean;
  className?: string;
} & Omit<LinkProps, 'href'>) => {
  return (
    <Link
      href='/'
      aria-label='Home'
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt='avatar'
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-gray-100 object-cover dark:bg-gray-800',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  );
};

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
            className='h-14 border-b border-gray-100 bg-white/[var(--bg-opacity-light)] backdrop-blur-sm transition dark:border-gray-700/40 dark:bg-gray-1000/[var(--bg-opacity-dark)] dark:backdrop-blur'
            style={
              {
                '--bg-opacity-light': bgOpacityLight,
                '--bg-opacity-dark': bgOpacityDark,
              } as MotionStyle
            }
          >
            <InnerContainer className='flex h-full items-center justify-between'>
              <div className='flex items-center justify-between'>
                <div className='flex flex-1'>
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                </div>
                <div className='flex items-center gap-5'>
                  <p>test1</p>
                  <p>test2</p>
                  <p>test3</p>
                </div>
              </div>
            </InnerContainer>
          </motion.div>
        </OuterContainer>
      </header>
    );
  },
);
