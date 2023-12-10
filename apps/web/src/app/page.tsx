import type { Metadata } from 'next';

import { Container } from '#/ui/feature/global';
import { Button } from '#/ui/general';

export const metadata = {
  title: 'kkhys.me',
} satisfies Metadata;

const Page = () => {
  return (
    <Container>
      <p className='text-sky-500'>Hello, world!</p>
      <Button>test</Button>
    </Container>
  );
};

export default Page;
