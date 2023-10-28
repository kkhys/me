import type { Metadata } from 'next';

import { Button } from '#/components/ui/button';

export const metadata = {
  title: 'kkhys.me',
} satisfies Metadata;

const HomePage = () => {
  return (
    <>
      <p className='text-sky-500'>Hello, world!</p>
      <Button>test</Button>
    </>
  );
};

export default HomePage;
