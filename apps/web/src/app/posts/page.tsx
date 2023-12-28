import * as React from 'react';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { serverEnv } from '#/env/index.mjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/data-display';
import { Container, FadeIn } from '#/ui/feature/global';
import { ArticleCards } from '#/ui/feature/posts';

export const metadata = {
  title: 'Blog',
} satisfies Metadata;

const Page = () => {
  const posts = allPosts
    .filter((post) => serverEnv.NODE_ENV === 'development' || post.status === 'published')
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)));
  const techPosts = posts.filter((post) => post.category.includes('Tech'));
  const lifePosts = posts.filter((post) => post.category.includes('Life'));

  return (
    <Container>
      <header>
        <h1 className='font-serif text-xl font-medium'>Blog</h1>
      </header>
      <Tabs defaultValue='all' className='mt-6'>
        <TabsList>
          <TabsTrigger value='all' className='font-serif'>
            All
          </TabsTrigger>
          <TabsTrigger value='tech' className='font-serif'>
            Tech
          </TabsTrigger>
          <TabsTrigger value='life' className='font-serif'>
            Life
          </TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          <FadeIn>
            <ArticleCards posts={posts} className='mt-8' />
          </FadeIn>
        </TabsContent>
        <TabsContent value='tech'>
          <FadeIn>
            <ArticleCards posts={techPosts} className='mt-8' />
          </FadeIn>
        </TabsContent>
        <TabsContent value='life'>
          <FadeIn>
            <ArticleCards posts={lifePosts} className='mt-8' />
          </FadeIn>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Page;
