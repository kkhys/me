import * as React from 'react';

import { Footer, Header } from '#/ui/global';

const VerticalGradient = () => (
  <div
    className='pointer-events-none z-10 h-[65px] w-full select-none bg-[linear-gradient(to_top,transparent,hsl(0_0%_8.5%))] opacity-0 backdrop-blur-[2px] dark:opacity-100'
    style={{ maskImage: 'linear-gradient(to bottom, hsl(0 0% 8.5%) 25%, transparent)' }}
  />
);

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className='fixed inset-0 flex w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] justify-center sm:px-8'>
      <div className='flex w-full max-w-6xl lg:px-8'>
        <div className='w-full bg-background-lighter ring-0.5 ring-zinc-100 dark:ring-zinc-300/20' />
      </div>
    </div>
    <div className='pointer-events-none fixed inset-0 z-10 flex w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] justify-center sm:px-8'>
      <div className='flex w-full max-w-6xl lg:px-8'>
        <VerticalGradient />
      </div>
    </div>
    <div className='relative flex w-full flex-col'>
      <Header className='z-10' />
      <main className='flex-auto'>
        <div className='mt-20 sm:px-8 md:mt-28'>{children}</div>
      </main>
      <Footer />
    </div>
  </>
);
