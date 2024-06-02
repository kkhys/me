import { Suspense } from 'react';
import * as React from 'react';

import { CommandMenu, ContainerInner, ContainerOuter, MainNavigation, MobileNavigation, ModeToggle } from '#/ui/global';

export const Header = ({ className }: { className?: string }) => (
  <header className={className}>
    <ContainerOuter className='flex items-center'>
      <div className='border-b border-zinc-100 py-2.5 dark:border-zinc-700/40'>
        <ContainerInner>
          <div className='flex w-full items-center justify-between'>
            <Suspense>
              <MainNavigation />
            </Suspense>
            <MobileNavigation />
            <div className='flex items-center space-x-2'>
              <CommandMenu />
              <ModeToggle />
            </div>
          </div>
        </ContainerInner>
      </div>
    </ContainerOuter>
  </header>
);
