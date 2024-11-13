import * as React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';

import { FadeIn, FadeInStagger, Prose } from '@kkhys/ui';

import { Container } from '#/ui/global';

const Page = () => {
  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-sans font-medium'>Keisuke Hayashi</h1>
        </FadeIn>
        <Prose className='font-sans'>
          <FadeIn>
            <p>
              Passion for hacking. Full-stack developer based in Tokyo. Love to
              make something and make people happy and surprised.
            </p>
          </FadeIn>
          <FadeIn>
            <p>
              I keep a blog to document my interests and my life. If you are
              interested, please take a look. Currently, only Japanese articles
              are available.
            </p>
          </FadeIn>
          <FadeIn>
            <Link
              href={{ pathname: '/posts' }}
              className='inline-flex items-center'
            >
              Read blog
              <ArrowRightIcon className='ml-1 size-3.5' />
            </Link>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
