import * as React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';

import { BackButton, Container } from '#/ui/feature/global';
import { CategoryTabs } from '#/ui/feature/posts';
import { JsonLd } from './json-ld';

export const generateMetadata = ({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) => {
  const category = (searchParams.category as string) ?? 'blog';
  return {
    title: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
    description: 'Blog posts of Keisuke Hayashi.',
    alternates: {
      canonical: '/posts',
    },
    openGraph: {
      url: '/posts',
    },
  } satisfies Metadata;
};

const Page = () => (
  <>
    <JsonLd />
    <Container>
      <BackButton href='/' tooltipContent='Go back to home' />
      <header>
        <h1 className='font-sans font-medium'>Blog</h1>
      </header>
      <Suspense>
        <CategoryTabs />
      </Suspense>
    </Container>
  </>
);

export default Page;
