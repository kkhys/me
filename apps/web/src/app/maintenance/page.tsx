import { redirect } from 'next/navigation';
import { get } from '@vercel/edge-config';

import { Container, FadeIn, FadeInStagger } from '#/ui/feature/global';
import { Prose } from '#/ui/general';

const Page = async () => {
  const isMaintenance = await get('isMaintenance');
  if (!isMaintenance) redirect('/');

  return (
    <Container>
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-serif text-xl font-medium'>The website under maintenance</h1>
        </FadeIn>
        <Prose className='font-serif'>
          <FadeIn>
            <p>It will be back up in a while, so please have a cup of coffee and relax.</p>
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};

export default Page;
