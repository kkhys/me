import type { Metadata } from 'next';
import Link from 'next/link';

import { Button, FadeIn, FadeInStagger, Prose } from '@kkhys/ui';

import { Container } from '#/ui/global';

export const metadata = {
  robots: 'noindex',
  title: 'Not Found',
  description: 'Sorry, but the page you were trying to view does not exist.',
} satisfies Metadata;

const NotFound = () => (
  <Container className='font-sans'>
    <FadeInStagger>
      <FadeIn>
        <h1 className='font-sans font-medium'>404 - Page Not Found</h1>
      </FadeIn>
      <FadeIn>
        <Prose>
          <p>Sorry, but the page you were trying to view does not exist.</p>
        </Prose>
      </FadeIn>
      <FadeIn>
        <Button variant='outline' asChild>
          <Link href='/'>Go back home</Link>
        </Button>
      </FadeIn>
    </FadeInStagger>
  </Container>
);

export default NotFound;
