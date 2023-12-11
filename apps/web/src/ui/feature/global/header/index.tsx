import { Container, ModeToggle } from '#/ui/feature/global';

export const Header = ({ className }: { className?: string }) => (
  <header className={className}>
    <Container className='flex h-14 items-center'>
      <div className='flex w-full items-center justify-end'>
        <ModeToggle />
      </div>
    </Container>
  </header>
);
