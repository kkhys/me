import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';

import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

export const metadata = {
  title: 'kkhys.me',
} satisfies Metadata;

const Page = () => {
  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-serif text-xl font-medium'>Keisuke Hayashi</h1>
        </FadeIn>
        <Prose className='font-serif'>
          <FadeIn>
            <p>
              <span className='font-sans text-lg'>Passion for hacking</span>. Full-stack developer based in Tokyo. Love
              to make something and make people happy and surprised.
            </p>
          </FadeIn>
          <FadeIn>
            <p>
              I keep a blog to document my interests and my life. If you are interested, please take a look. Currently,
              only Japanese articles are available.
            </p>
          </FadeIn>
          <FadeIn>
            <Link href={{ pathname: '/posts' }} className='inline-flex items-center'>
              Read blog
              <ArrowRightIcon className='ml-1 h-3.5 w-3.5' />
            </Link>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
