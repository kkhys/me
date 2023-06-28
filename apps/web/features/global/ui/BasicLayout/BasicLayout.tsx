import { type ReactNode } from 'react';

import { Footer, Header } from '#/features/global/ui';

export const BasicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <div>
        <Header />
        <main className='px-4 pt-14 sm:px-6 lg:px-8'>{children}</main>
      </div>
      <Footer />
    </div>
  );
};
