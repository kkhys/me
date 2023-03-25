import { Footer } from '#/components/global';
import { Container } from '#/components/layout';

const HomePage = () => {
  return (
    <>
      <Container>
        <div className='flex items-center justify-center'>
          <h1 className='flex h-screen items-center justify-center text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
            Coming soon...
          </h1>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
