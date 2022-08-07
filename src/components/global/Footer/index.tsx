import React from 'react';
import { Section, Text } from '^/elements';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type FooterProps = {
  copyright: string;
  location: WindowLocation;
};

export const Footer: FC<FooterProps> = ({
  copyright,
  location: { pathname },
}) => {
  const isHome = pathname === '/';

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as='footer'
      role='contentinfo'
      display='flex'
      className='justify-center bg-primary py-8 px-6 text-contrast dark:bg-contrast dark:text-primary md:px-8 lg:px-12'
    >
      <div className='opacity-50'>
        <Text>{copyright}</Text>
      </div>
    </Section>
  );
};
