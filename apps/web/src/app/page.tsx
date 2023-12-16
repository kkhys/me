import type { Metadata } from 'next';

import { Container } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

export const metadata = {
  title: 'kkhys.me',
} satisfies Metadata;

const Page = () => {
  return (
    <Container>
      <Prose className='mt-16 font-serif'>
        <h1>Keisuke Hayashi</h1>
        <p>
          <span className='font-sans'>Passion for hacking</span>. Full-stack developer based in Tokyo with making the
          most out of the least amount of effort. Love to make something and make people happy and surprised.
        </p>
        <p>In the past I’ve designed clothes and made patterns.</p>
      </Prose>
    </Container>
  );
};

export default Page;
