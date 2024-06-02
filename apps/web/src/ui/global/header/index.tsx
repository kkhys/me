import { Suspense } from 'react';

import { Container, MainNavigation, MobileNavigation, ModeToggle } from '#/ui/global';

export const Header = ({ className }: { className?: string }) => (
  <header className={className}>
    <Container className='flex h-14 items-center'>
      <div className='flex w-full items-center justify-between'>
        <Suspense>
          <MainNavigation />
        </Suspense>
        <MobileNavigation />
        <ModeToggle />
      </div>
    </Container>
  </header>
);
