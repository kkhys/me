import * as React from 'react';

import { Footer, Header } from '#/ui/feature/global';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className='fixed inset-0 flex justify-center sm:px-8'>
      <div className='flex w-full max-w-6xl lg:px-8'>
        <div className='bg-background-lighter ring-0.5 w-full ring-zinc-100 dark:ring-zinc-300/20' />
      </div>
    </div>
    <div className='relative flex w-full flex-col'>
      <Header />
      <main className='flex-auto'>
        <div className='mt-4 sm:px-8 md:mt-16'>{children}</div>
      </main>
      <Footer />
    </div>
  </>
);
