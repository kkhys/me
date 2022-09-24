import React from 'react';
import { Section, Text } from '^/elements';
import type { FC } from 'react';

type FooterProps = {
  copyright: string;
};

export const Footer: FC<FooterProps> = ({ copyright }) => (
  <Section
    as='footer'
    role='contentinfo'
    display='flex'
    className='justify-center bg-contrast py-8 px-6 md:px-8 lg:px-12'
  >
    <Text color='subtle'>{copyright}</Text>
  </Section>
);
