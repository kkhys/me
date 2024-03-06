import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { cn } from '#/lib/shadcn-ui/utils';
import { LinkCard, MermaidBlock, Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/data-display';
import { ArticleImage, GoogleMaps, HeaderWithAnchor, Tweet, YouTube } from '#/ui/feature/posts';
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
  svg: ({ children, ...props }) => <MermaidBlock {...props}>{children}</MermaidBlock>,
  'link-card': (props: React.ComponentPropsWithoutRef<typeof LinkCard>) => <LinkCard {...props} />,
  'youtube-embed': (props: React.ComponentPropsWithoutRef<typeof YouTube>) => <YouTube {...props} />,
  'tweet-embed': (props: React.ComponentPropsWithoutRef<typeof Tweet>) => <Tweet {...props} />,
  GoogleMaps,
  Tabs,
  TabsList: ({ className, ...props }: React.ComponentProps<typeof TabsList>) => (
    <TabsList className={cn('w-full justify-start rounded-none border-b bg-transparent p-0', className)} {...props} />
  ),
  TabsTrigger: ({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:bg-background-lighter relative h-9 rounded-none border-b border-b-transparent bg-transparent px-4 pb-3 pt-2 shadow-none transition-none data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    />
  ),
  TabsContent,
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
