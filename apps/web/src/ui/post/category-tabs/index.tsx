'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { RssIcon } from 'lucide-react';

import {
  Button,
  FadeIn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kkhys/ui';

import { env } from '#/env';
import { ArticleList } from '#/ui/post';

const useCategory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = (categoryParam: string) => {
    switch (categoryParam) {
      case 'all':
      case 'tech':
      case 'life':
      case 'object':
      case 'build':
        return categoryParam;
      default:
        return 'notfound';
    }
  };

  const [category, setCategory] = React.useState(initialCategory(searchParams.get('category') ?? 'all'));

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }

    params.delete('page');

    setCategory(value);
    router.replace(`/posts?${params.toString()}`);
  };

  React.useEffect(() => {
    setCategory(initialCategory(searchParams.get('category') ?? 'all'));
  }, [searchParams]);

  return { category, handleValueChange };
};

export const CategoryTabs = () => {
  const { category, handleValueChange } = useCategory();

  const posts = allPosts
    .filter((post) => env.NODE_ENV === 'development' || post.status === 'published')
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)));
  const techPosts = posts.filter((post) => post.category.includes('Tech'));
  const lifePosts = posts.filter((post) => post.category.includes('Life'));
  const objectPosts = posts.filter((post) => post.category.includes('Object'));
  const buildPosts = posts.filter((post) => post.category.includes('Build'));

  return (
    <Tabs defaultValue={category} onValueChange={handleValueChange} value={category} className='mt-6'>
      <div className='flex gap-4'>
        <TabsList>
          <TabsTrigger value='all' className='font-sans'>
            All
          </TabsTrigger>
          <TabsTrigger value='tech' className='font-sans'>
            Tech
          </TabsTrigger>
          <TabsTrigger value='life' className='font-sans'>
            Life
          </TabsTrigger>
          <TabsTrigger value='object' className='font-sans'>
            Object
          </TabsTrigger>
          <TabsTrigger value='build' className='font-sans'>
            Build
          </TabsTrigger>
        </TabsList>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant='outline' size='icon'>
                <Link href='/atom' prefetch={false}>
                  <RssIcon className='size-4' />
                  <span className='sr-only'>Atom</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className='flex items-center'>
                <p className='font-sans'>Atom</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <TabsContent value='all'>
        <FadeIn>
          <ArticleList posts={posts} className='mt-8' />
        </FadeIn>
      </TabsContent>
      <TabsContent value='tech'>
        <FadeIn>
          <ArticleList posts={techPosts} className='mt-8' />
        </FadeIn>
      </TabsContent>
      <TabsContent value='life'>
        <FadeIn>
          <ArticleList posts={lifePosts} className='mt-8' />
        </FadeIn>
      </TabsContent>
      <TabsContent value='object'>
        <FadeIn>
          <ArticleList posts={objectPosts} className='mt-8' />
        </FadeIn>
      </TabsContent>
      <TabsContent value='build'>
        <FadeIn>
          <ArticleList posts={buildPosts} className='mt-8' />
        </FadeIn>
      </TabsContent>
      <TabsContent value='notfound'>
        <FadeIn>
          <div className='mt-8'>
            <p className='font-sans'>No articles tied to this category.</p>
          </div>
        </FadeIn>
      </TabsContent>
    </Tabs>
  );
};

export const CategoryTabsFallback = () => (
  <Tabs className='mt-6'>
    <div className='flex gap-4'>
      <TabsList>
        <TabsTrigger value='all' className='font-sans'>
          All
        </TabsTrigger>
        <TabsTrigger value='tech' className='font-sans'>
          Tech
        </TabsTrigger>
        <TabsTrigger value='life' className='font-sans'>
          Life
        </TabsTrigger>
      </TabsList>
      <Button variant='outline' size='icon'>
        <RssIcon className='size-4' />
        <span className='sr-only'>Atom</span>
      </Button>
    </div>
  </Tabs>
);
