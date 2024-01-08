import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { Code } from './code';
import { Heading } from './heading';

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
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
