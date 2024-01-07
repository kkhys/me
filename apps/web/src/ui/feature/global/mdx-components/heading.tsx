'use client';

import * as React from 'react';
import Link from 'next/link';
import { useInView } from 'framer-motion';

const remToPx = (remValue: number) => {
  const rootFontSize =
    typeof window === 'undefined' ? 16 : parseFloat(window.getComputedStyle(document.documentElement).fontSize);

  return remValue * rootFontSize;
};

const AnchorIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => (
  <svg viewBox='0 0 20 20' fill='none' strokeLinecap='round' aria-hidden='true' {...props}>
    <path d='m6.5 11.5-.964-.964a3.535 3.535 0 1 1 5-5l.964.964m2 2 .964.964a3.536 3.536 0 0 1-5 5L8.5 13.5m0-5 3 3' />
  </svg>
);

const Anchor = ({ id, inView, children }: { id: string; inView: boolean; children: React.ReactNode }) => (
  <Link href={`#${id}`} className='group text-inherit no-underline hover:text-inherit'>
    {inView && (
      <div className='absolute ml-[calc(-1*var(--width))] mt-1 hidden w-[var(--width)] opacity-0 transition [--width:calc(2.625rem+0.5px+50%-min(50%,calc(theme(maxWidth.lg)+theme(spacing.8))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:theme(spacing.10)]'>
        <div className='group/anchor bg-secondary ring-0.5 block size-5 rounded-lg ring-inset ring-zinc-300 transition hover:ring-zinc-500 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600'>
          <AnchorIcon className='size-5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white' />
        </div>
      </div>
    )}
    {children}
  </Link>
);

export const Heading = <Level extends 2 | 3>({
  children,
  level,
  anchor = true,
  ...props
}: React.ComponentPropsWithoutRef<`h${Level}`> & {
  id?: string;
  level?: Level;
  anchor?: boolean;
}) => {
  level = level ?? (2 as Level);
  const Component = `h${level}` as 'h2' | 'h3';
  const ref = React.useRef<HTMLHeadingElement>(null);

  const inView = useInView(ref, {
    margin: `${remToPx(-2.5)}px 0px 0px 0px`,
    amount: 'all',
  });

  return (
    <Component ref={ref} className='scroll-mt-12' {...props}>
      {anchor && props.id ? (
        <Anchor id={props.id} inView={inView}>
          {children}
        </Anchor>
      ) : (
        children
      )}
    </Component>
  );
};
