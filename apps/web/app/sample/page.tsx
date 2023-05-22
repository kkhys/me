import { Footer, Header, ThemeButton } from '#/features/global/ui';
import { Container } from '#/ui';

const SampleLayout = () => {
  return (
    <>
      <Header />
      <Container>
        <div className='flex items-center justify-center'>
          <h1 className='flex h-screen items-center justify-center text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
            Coming soon...
          </h1>
          <ThemeButton />
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default SampleLayout;
