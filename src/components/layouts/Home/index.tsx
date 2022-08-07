import React from 'react';
import { Text } from '^/elements';
import { Footer, Header } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type HomeLayoutProps = {
  title: string;
  location: WindowLocation;
  copyright: string;
};

const HomeLayout: FC<HomeLayoutProps> = ({ title, location, copyright }) => (
  <>
    <Header title={title} location={location} />
    <main role='main' className='grow'>
      <Text>test</Text>
    </main>
    <Footer copyright={copyright} location={location} />
  </>
);

export default HomeLayout;
