import * as React from 'react';
import type { Metadata } from 'next';

import { Container } from '#/ui/feature/global';
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
      <header>
        <h1 className='font-serif text-xl font-medium'>Blog</h1>
      </header>
      <CategoryTabs />
    </Container>
  </>
);

export default Page;
