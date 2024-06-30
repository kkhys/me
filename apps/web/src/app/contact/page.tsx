import type { Metadata } from 'next';
import * as React from 'react';

import { FadeIn } from '@kkhys/ui';

import { ContactForm } from '#/ui/contact';
import { BackButton, Container } from '#/ui/global';
import { JsonLd } from './json-ld';

export const metadata = {
  title: 'Contact',
  description: 'Contact page of Keisuke Hayashi.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    url: '/contact',
  },
} satisfies Metadata;

const Page = () => {
  return (
    <>
      <JsonLd />
      <Container>
        <BackButton href='/' tooltipContent='Go back to home' />
        <header>
          <h1 className='font-sans font-medium'>Contact</h1>
        </header>
        <FadeIn>
          <ContactForm className='mt-6' />
        </FadeIn>
      </Container>
    </>
  );
};

export default Page;
