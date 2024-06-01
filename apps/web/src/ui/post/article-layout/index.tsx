import type { Post } from 'contentlayer/generated';
import * as React from 'react';
import { Suspense } from 'react';
import { allPosts } from 'contentlayer/generated';

import { FadeIn, FadeInStagger, Prose } from '@kkhys/ui';

import { env } from '#/env';
import { BackButton, Container } from '#/ui/global';
import {
  ActionController,
  EyeCatch,
  Mdx,
  PrevAndNextPager,
  RelatedPosts,
  Time,
  ViewCounter,
  ViewCounterSkeleton,
} from '#/ui/post';
import { fisherYatesShuffle } from '#/utils';

export const ArticleLayout = ({ post }: { post: Post }) => {
  const {
    title,
    category,
    emoji,
    publishedAt,
    publishedAtFormattedUs,
    status,
    _id: id,
    slug,
    body: { code },
  } = post;

  const relatedPosts = fisherYatesShuffle(
    allPosts.filter((post) => post.status === 'published' && post._id !== id && post.category === category),
  ).slice(0, 5);

  return (
    <Container>
      <BackButton href='/posts' tooltipContent='Go back to posts list' />
      <FadeInStagger faster>
        <article>
          <header>
            <FadeIn className='flex justify-between'>
              <EyeCatch emoji={emoji} />
              {status === 'draft' && <span className='font-sans text-xs text-red-400'>Draft</span>}
            </FadeIn>
            <FadeIn>
              <h1 className='palt mt-4 font-medium'>{title}</h1>
            </FadeIn>
            <FadeIn>
              <div className='mt-2 flex items-center justify-between'>
                <Time publishedAt={publishedAt} publishedAtFormattedUs={publishedAtFormattedUs} />
                {env.NODE_ENV !== 'development' ? (
                  <Suspense fallback={<ViewCounterSkeleton />}>
                    <ViewCounter slug={slug} />
                  </Suspense>
                ) : (
                  <p className='font-sans text-sm text-muted-foreground'>xxx views</p>
                )}
              </div>
            </FadeIn>
          </header>
          <FadeIn>
            <Prose>
              <Mdx code={code} />
            </Prose>
          </FadeIn>
          <FadeIn>
            <ActionController className='mt-12' post={post} />
          </FadeIn>
          <FadeIn>
            <PrevAndNextPager id={id} className='mt-8' />
          </FadeIn>
          {relatedPosts.length !== 0 && (
            <FadeIn>
              <RelatedPosts className='mt-8' relatedPosts={relatedPosts} />
            </FadeIn>
          )}
        </article>
      </FadeInStagger>
    </Container>
  );
};
