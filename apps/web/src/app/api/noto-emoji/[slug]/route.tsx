import type { NextRequest } from 'next/server';
import emojiRegex from 'emoji-regex';
import satori from 'satori';

export const runtime = 'edge';

export const GET = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } },
) => {
  const rawText = slug.endsWith('.svg') ? slug.replace('.svg', '') : '';

  if (!rawText.length || !isEmoji(rawText)) {
    return new Response('Invalid URL', {
      status: 400,
    });
  }

  const firstEmoji = Array.from(rawText)[0];

  const notoEmojiRegular = await fetch(
    new URL(
      '../../../../../assets/fonts/NotoEmoji-Regular.ttf',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get('theme') ?? 'light';

  const svg = await satori(
    <div
      style={{
        fontSize: 21,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Noto Emoji',
        fontSmooth: 'antialiased',
        color: theme === 'dark' ? '#e6e5e5' : '#0a0a0b',
      }}
    >
      {firstEmoji}
    </div>,
    {
      width: 24,
      height: 24,
      fonts: [
        {
          name: 'Noto Emoji',
          data: notoEmojiRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'X-Content-Type-Options': 'nosniff',
      'cache-control': 'public, immutable, no-transform, max-age=31536000',
    },
  });
};

/**
 * Checks if a given string contains an emoji.
 *
 * @param str - The string to check for emoji.
 * @returns Returns true if the string contains an emoji, false otherwise.
 */
const isEmoji = (str: string) => emojiRegex().test(str);
