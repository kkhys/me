import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

const AppleIcon = () => {
  return new ImageResponse(
    (
      // eslint-disable-next-line react/no-unknown-property
      <div tw='flex h-full w-full items-center justify-center bg-zinc-900 font-mono text-9xl font-medium text-zinc-100 opacity-90'>
        K
      </div>
    ),
    {
      ...size,
    },
  );
};

export default AppleIcon;
