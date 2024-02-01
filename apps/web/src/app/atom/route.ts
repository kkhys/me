import { NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { Feed } from 'feed';

import { me, site } from '#/config';

// eslint-disable-next-line @typescript-eslint/require-await
export const GET = async (): Promise<NextResponse> => {
  const posts = allPosts
    .filter((post) => post.status === 'published')
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)));

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: new URL(site.url.base).toString(),
    link: new URL(site.url.base).toString(),
    image: new URL('opengragh-image', site.url.base).toString(),
    favicon: new URL('icon', site.url.base).toString(),
    copyright: 'CC BY-NC-SA 4.0 2023-PRESENT © Keisuke Hayashi',
    author: {
      name: me.name,
      email: me.email,
      link: new URL(site.url.base).toString(),
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: new URL(`posts/${post.slug}`, site.url.base).toString(),
      link: new URL(`posts/${post.slug}`, site.url.base).toString(),
      description: post.excerpt,
      author: [
        {
          name: me.name,
          email: me.email,
          link: new URL(site.url.base).toString(),
        },
      ],
      date: new Date(post.publishedAt),
      image: new URL(`/posts/${post.slug}/opengraph-image/default`, site.url.base).toString(),
    });
  });

  const atom = feed.atom1();

  return new NextResponse(atom, {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'Content-Type': 'text/xml',
    },
  });
};
