import * as React from 'react';
import type { Post } from 'contentlayer/generated';
import { allPosts } from 'contentlayer/generated';
import { formatDistanceStrict, parseISO } from 'date-fns';

import { BackButton, Container, FadeIn, FadeInStagger, Mdx } from '#/ui/feature/global';
import { ActionController, EyeCatch, PrevAndNextPager, RelatedPosts } from '#/ui/feature/posts';
import { Prose } from '#/ui/general';
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
    body: { code },
  } = post;

  const publishedAtDistanceToNow = (date: string) => formatDistanceStrict(parseISO(date), new Date());

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
              <h1 className='palt mt-4 text-xl font-medium'>{title}</h1>
            </FadeIn>
            <FadeIn>
              <time className='text-muted-foreground mt-3 block font-sans text-sm' dateTime={publishedAt}>
                {publishedAtFormattedUs} ({publishedAtDistanceToNow(publishedAt)} ago)
              </time>
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
