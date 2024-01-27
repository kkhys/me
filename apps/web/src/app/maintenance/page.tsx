import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { get } from '@vercel/edge-config';

import { env } from '#/env.mjs';
import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

export const metadata = {
  robots: 'noindex',
  title: 'Maintenance',
  description: 'It will be back up in a while, so please have a cup of coffee and relax.',
} satisfies Metadata;

const Page = async () => {
  if (!env.CI) {
    const isMaintenance = await get<boolean>('isMaintenance');
    if (!isMaintenance) redirect('/');
  }

  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-sans text-xl font-medium'>The website under maintenance</h1>
        </FadeIn>
        <Prose className='font-sans'>
          <FadeIn>
            <p>It will be back up in a while, so please have a cup of coffee and relax.</p>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
