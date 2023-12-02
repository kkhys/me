import type { Metadata } from 'next';

import { Button } from '#/ui/general';

export const metadata = {
  title: 'kkhys.me',
} satisfies Metadata;

const Page = () => {
  return (
    <>
      <p className='text-sky-500'>Hello, world!</p>
      <Button>test</Button>
    </>
  );
};

export default Page;
