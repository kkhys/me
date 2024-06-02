import type { NextRequest } from 'next/server';
import satori from 'satori';

export const runtime = 'edge';

export const GET = async (request: NextRequest) => {
  const interMedium = await fetch(new URL('../../../../assets/fonts/Inter-Medium.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get('theme') ?? 'light';

  const svg = await satori(
    <div
      style={{
        fontSize: 130,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter',
        fontSmooth: 'antialiased',
        color: theme === 'dark' ? '#111113' : '#e6e5e5',
        backgroundColor: theme === 'dark' ? '#e6e5e5' : '#111113',
      }}
    >
      K
    </div>,
    {
      width: 256,
      height: 256,
      fonts: [
        {
          name: 'Inter',
          data: interMedium,
          style: 'normal',
          weight: 500,
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
