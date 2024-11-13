import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { get } from '@vercel/edge-config';

import { FadeIn, FadeInStagger, Prose } from '@kkhys/ui';

import { env } from '#/env';
import { Container } from '#/ui/global';

export const metadata = {
  robots: 'noindex',
  title: 'Maintenance',
  description:
    'It will be back up in a while, so please have a cup of coffee and relax.',
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
          <h1 className='font-sans font-medium'>
            The website under maintenance
          </h1>
        </FadeIn>
        <Prose className='font-sans'>
          <FadeIn>
            <p>
              It will be back up in a while, so please have a cup of coffee and
              relax.
            </p>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
