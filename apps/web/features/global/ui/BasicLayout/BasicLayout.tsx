import { type ReactNode } from 'react';

import { Footer, Header } from '#/features/global/ui';

export const BasicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <div>
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
};
