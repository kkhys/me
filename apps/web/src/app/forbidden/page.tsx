import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { get } from '@vercel/edge-config';

import { env } from '#/env';
import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

export const metadata = {
  robots: 'noindex',
  title: 'Forbidden',
  description: 'You have been denied access for some reason.',
} satisfies Metadata;

const Page = async () => {
  if (!env.CI) {
    const blockIps = await get<string[]>('blockIps');
    if (!blockIps?.length) redirect('/');
  }

  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-sans font-medium'>403 - Forbidden</h1>
        </FadeIn>
        <Prose className='font-sans'>
          <FadeIn>
            <p>You have been denied access for some reason.</p>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
