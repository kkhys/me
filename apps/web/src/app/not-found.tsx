import Link from 'next/link';

import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Button, Prose } from '#/ui/general';

const NotFound = () => (
  <Container className='font-serif'>
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
