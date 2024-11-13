'use client';

import { Suspense } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';

import { cn } from '@kkhys/ui';

import {
  CommandMenu,
  ContainerInner,
  ContainerOuter,
  MainNavigation,
  MainNavigationFallback,
  MobileNavigation,
  ModeToggle,
} from '#/ui/global';

export const useHeaderAnimation = () => {
  const [animationHeader, setAnimationHeader] = React.useState<boolean | null>(
    null,
  );
  const [previousYPosition, setPreviousYPosition] = React.useState<number>(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );
  const [debouncePreviousYPosition] = useDebounce(previousYPosition, 50);
  const headerRef = React.useRef<HTMLElement | null>(null);

  const headerFrom = () => ({
    y: 0,
  });

  const headerTo = (headerHeight: number) => ({
    y: -headerHeight,
  });

  const animationState = () => {
    if (animationHeader === null || headerRef.current === null) return;
    return animationHeader
      ? headerFrom()
      : headerTo(headerRef.current.offsetHeight);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current === null) return;

      const currentYPos = window.scrollY;
      const headerHeight = headerRef.current.offsetHeight / 2;

      if (currentYPos < previousYPosition) {
        setAnimationHeader(true);
      } else if (
        currentYPos > headerHeight &&
        currentYPos > previousYPosition
      ) {
        setAnimationHeader(false);
      }

      setPreviousYPosition(currentYPos);
    };

    window.addEventListener('scroll', handleScroll, false);

    return () => window.removeEventListener('scroll', handleScroll, false);
  }, [debouncePreviousYPosition, previousYPosition]);

  return { animationState, headerRef };
};

export const Header = ({ className }: { className?: string }) => {
  const { animationState, headerRef } = useHeaderAnimation();

  return (
    <motion.header
      transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
      animate={animationState()}
      ref={headerRef}
      className={cn(
        'fixed top-0 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))]',
        className,
      )}
    >
      <ContainerOuter className='flex items-center'>
        <div className='border-b border-border/60 bg-background-lighter/95 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background-lighter/60'>
          <ContainerInner>
            <div className='flex w-full items-center justify-between'>
              <Suspense fallback={<MainNavigationFallback />}>
                <MainNavigation />
              </Suspense>
              <MobileNavigation />
              <div className='flex items-center space-x-2'>
                <CommandMenu />
                <ModeToggle />
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </motion.header>
  );
};
