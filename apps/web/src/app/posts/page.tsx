import * as React from 'react';
import type { Metadata } from 'next';
import { clsx } from 'clsx';
import type { Post } from 'contentlayer/generated';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/data-display';
import { Container, FadeIn } from '#/ui/feature/global';
import { ArticleCard } from '#/ui/feature/posts';

export const metadata = {
  title: 'Blog',
} satisfies Metadata;

const ArticleCards = ({ posts, className }: { posts: Post[]; className?: string }) => {
  if (!posts.length)
    return (
      <div className={className}>
        <p className='font-serif'>No posts found.</p>
      </div>
    );

  return (
    <div className={clsx('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  );
};

const Page = () => {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)));
  const techPosts = posts.filter((post) => post.category.includes('Tech'));
  const lifePosts = posts.filter((post) => post.category.includes('Life'));

  return (
    <Container>
      <header>
        <h1 className='font-serif text-lg font-medium'>Blog</h1>
      </header>
      <Tabs defaultValue='all' className='mt-6 space-y-4'>
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
