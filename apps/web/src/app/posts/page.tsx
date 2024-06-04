import type { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import { BackButton, Container } from '#/ui/global';
import { CategoryTabs } from '#/ui/post';
import { JsonLd } from './json-ld';

export const metadata = {
  title: 'Blog',
  description: 'Blog posts of Keisuke Hayashi.',
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    url: '/posts',
  },
} satisfies Metadata;

const Page = () => (
  <>
    <JsonLd />
    <Container>
      <BackButton href='/' tooltipContent='Go back to home' />
      <header>
        <h1 className='font-sans font-medium'>Blog</h1>
      </header>
      <Suspense fallback={null}>
        <CategoryTabs />
      </Suspense>
    </Container>
  </>
);

export default Page;
