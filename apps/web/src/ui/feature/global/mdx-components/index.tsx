import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { LinkCard, MermaidBlock } from '#/ui/data-display';
import { ArticleImage, HeaderWithAnchor } from '#/ui/feature/posts';
import { Code } from './code';

const components = {
  h2: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof HeaderWithAnchor>, 'level'>) => (
    <HeaderWithAnchor level={2} {...props}>
      {children}
    </HeaderWithAnchor>
  ),
  h3: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof HeaderWithAnchor>, 'level'>) => (
    <HeaderWithAnchor level={3} {...props}>
      {children}
    </HeaderWithAnchor>
  ),
  a: ({ children, href = '', ...props }: React.ComponentPropsWithoutRef<'a'>) => {
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
  img: (props: React.ComponentPropsWithoutRef<typeof ArticleImage>) => <ArticleImage {...props} />,
  'link-card': (props: React.ComponentPropsWithoutRef<typeof LinkCard>) => <LinkCard {...props} />,
  svg: ({ children, ...props }) => <MermaidBlock {...props}>{children}</MermaidBlock>,
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
