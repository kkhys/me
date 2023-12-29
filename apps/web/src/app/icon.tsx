import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

const Icon = () => {
  return new ImageResponse(
    (
      // eslint-disable-next-line react/no-unknown-property
      <div tw='flex h-full w-full items-center justify-center bg-zinc-900 font-mono text-xl font-bold text-zinc-100 opacity-90'>
        K
      </div>
    ),
    {
      ...size,
    },
  );
};

export default Icon;
