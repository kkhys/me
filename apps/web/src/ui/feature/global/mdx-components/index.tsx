import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { Code } from './code';
import { Heading } from './heading';
import { GrayscaleTransitionImage } from './image';

const components = {
  h2: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) => (
    <Heading level={2} {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) => (
    <Heading level={3} {...props}>
      {children}
    </Heading>
  ),
  a: ({ children, href = '', ...props }) => {
    if (href.startsWith('http')) {
      return (
        <a href={href} target='_blank' rel='noopener noreferrer' className='inline-flex items-center' {...props}>
          {children}
          <ArrowTopRightIcon className='ml-0.5 size-3' />
        </a>
      );
    }

    return (
      <Link href={href as Route} {...props}>
        {children}
      </Link>
    );
  },
  figure: ({ children, ...props }) => <Code {...props}>{children}</Code>,
  Img: ({ className, ...props }: React.ComponentPropsWithoutRef<typeof GrayscaleTransitionImage>) => (
    <div className={clsx('group isolate overflow-hidden rounded-2xl', className)}>
      <GrayscaleTransitionImage sizes='(min-width: 768px) 42rem, 100vw' className='w-full' quality={80} {...props} />
    </div>
  ),
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
