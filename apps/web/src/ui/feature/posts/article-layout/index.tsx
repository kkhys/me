import * as React from 'react';
import type { Post } from 'contentlayer/generated';
import { formatDistanceStrict, parseISO } from 'date-fns';

import { BackButton, Container, FadeIn, FadeInStagger, Mdx } from '#/ui/feature/global';
import { EyeCatch } from '#/ui/feature/posts';
import { Prose } from '#/ui/general';

export const ArticleLayout = ({ post }: { post: Post }) => {
  const {
    title,
    emoji,
    publishedAt,
    publishedAtFormatted,
    status,
    body: { code },
  } = post;

  const publishedAtDistanceToNow = (date: string) => formatDistanceStrict(parseISO(date), new Date());

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
              <h1 className='mt-4 text-xl font-medium'>{title}</h1>
            </FadeIn>
            <FadeIn>
              <time className='text-muted-foreground mt-3 block font-sans text-sm' dateTime={publishedAt}>
                {publishedAtFormatted} ({publishedAtDistanceToNow(publishedAt)} ago)
              </time>
            </FadeIn>
          </header>
          <FadeIn>
            <Prose>
              <Mdx code={code} />
            </Prose>
          </FadeIn>
        </article>
      </FadeInStagger>
    </Container>
  );
};
