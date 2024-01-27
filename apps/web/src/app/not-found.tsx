import type { Metadata } from 'next';
import Link from 'next/link';

import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Button, Prose } from '#/ui/general';

export const metadata = {
  robots: 'noindex',
  title: 'Not Found',
  description: 'Sorry, but the page you were trying to view does not exist.',
} satisfies Metadata;

const NotFound = () => (
  <Container className='font-sans'>
    <FadeInStagger>
      <FadeIn>
        <h1 className='text-xl font-medium'>404 - Page Not Found</h1>
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
