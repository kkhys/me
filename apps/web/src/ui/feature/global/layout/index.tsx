import * as React from 'react';

import { Footer } from '#/ui/feature/global';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className='fixed inset-0 flex justify-center sm:px-8'>
      <div className='flex w-full max-w-7xl lg:px-8'>
        <div className='bg-background-lighter w-full ring-1 ring-zinc-100 dark:ring-zinc-300/20' />
      </div>
    </div>
    <div className='relative flex w-full flex-col'>
      {/*<Header />*/}
      <main className='flex-auto'>{children}</main>
      <Footer />
    </div>
  </>
);
