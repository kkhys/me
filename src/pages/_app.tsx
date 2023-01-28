import { useEffect, useRef } from 'react';

import '@/styles/globals.scss';
// FIXME
// eslint-disable-next-line import/no-extraneous-dependencies
import 'focus-visible';
import type { AppProps } from 'next/app';

const usePrevious = (value: any) => {
  let ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const App = ({ Component, pageProps, router }: AppProps) => {
  let previousPathname = usePrevious(router.pathname);

  return (
    <>
      <div className='fixed inset-0 flex justify-center sm:px-8'>
        <div className='flex w-full max-w-7xl lg:px-8'>
          <div className='w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20' />
        </div>
      </div>
      <div className='relative'>
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
        </main>
      </div>
    </>
  );
};

export default App;
