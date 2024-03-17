import type { MDXComponents } from 'mdx/types';
import type { Route } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { cn } from '#/lib/shadcn-ui/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/ui/data-display';
import {
  Alert,
  ArticleImage,
  CarouselBlock,
  Details,
  Footnotes,
  GoogleMaps,
  HeaderWithAnchor,
  LinkCard,
  MermaidBlock,
  Step,
  Steps,
  Tweet,
  YouTube,
} from '#/ui/feature/posts';
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
        'relative h-9 rounded-none border-b border-b-transparent bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:bg-background-lighter data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    />
  ),
  TabsContent: ({ className, ...props }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent className={cn('mt-4 first:[&>*]:mt-0 last:[&>*]:mb-0', className)} {...props} />
  ),
  Accordion: ({ className, ...props }: React.ComponentProps<typeof Accordion>) => (
    <Accordion className={cn('border-t', className)} {...props} />
  ),
  AccordionContent: ({ className, ...props }: React.ComponentProps<typeof AccordionContent>) => (
    <AccordionContent className={cn('first:[&>div>*]:mt-0 last:[&>div>*]:mb-0', className)} {...props} />
  ),
  AccordionItem: ({ className, ...props }: React.ComponentProps<typeof AccordionItem>) => (
    <AccordionItem className={cn('[&>h3]:m-0', className)} {...props} />
  ),
  AccordionTrigger: ({ className, ...props }: React.ComponentProps<typeof AccordionTrigger>) => (
    <AccordionTrigger className={cn('[&>p]:m-0', className)} {...props} />
  ),
  Details,
  Alert,
  Step,
  Steps,
  section: ({ children, ...props }: React.ComponentProps<'section'> & { 'data-footnotes'?: boolean }) => {
    if (typeof props['data-footnotes'] === 'undefined') return <section {...props} />;
    return <Footnotes>{children}</Footnotes>;
  },
  Carousel: ({ children, ...props }: React.ComponentProps<typeof CarouselBlock>) => (
    <CarouselBlock {...props}>{children}</CarouselBlock>
  ),
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
