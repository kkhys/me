import { ImageResponse } from 'next/og';
import { allPosts } from 'contentlayer/generated';

import { env } from '#/env.mjs';

export const runtime = 'edge';

export const alt = 'Blog';

export const size = {
  width: 500,
  height: 500,
};

export const contentType = 'image/png';

const Image = async ({ params: { slug } }: { params: { slug: string } }) => {
  const post = allPosts.find(
    (post) => (env.NODE_ENV === 'development' || post.status === 'published') && post.slug === slug,
  );
  if (!post) return new Response('Not found', { status: 404 });

  const notoEmojiSemiBold = await fetch(
    new URL('../../../../assets/fonts/NotoEmoji-SemiBold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: '#0a0a0b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Noto Emoji',
          color: '#e4e4e7',
        }}
      >
        {post.emoji}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Emoji',
          data: notoEmojiSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
};

export default Image;
