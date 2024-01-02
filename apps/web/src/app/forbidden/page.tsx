import type { Metadata } from 'next';

import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

export const metadata = {
  robots: 'noindex',
  title: 'Forbidden',
  description: 'You have been denied access for some reason.',
} satisfies Metadata;

const Page = () => {
  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-serif text-xl font-medium'>403 - Forbidden</h1>
        </FadeIn>
        <Prose className='font-serif'>
          <FadeIn>
            <p>You have been denied access for some reason.</p>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
