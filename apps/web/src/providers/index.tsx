'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { env } from '#/env';
import { ThemeProvider } from '#/lib/nextjs/theme-provider';
import { TRPCReactProvider } from '#/lib/trpc/react';

/**
 * A custom hook that returns the previous value of a given variable.
 *
 * @template T - The type of the variable.
 * @param value - The current value of the variable.
 * @returns The previous value of the variable.
 */
const usePrevious = <T,>(value: T) => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const AppContext = React.createContext<{ previousPathname?: string }>(
  {},
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const previousPathname = usePrevious(pathname);

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <TRPCReactProvider>
          <GoogleReCaptchaProvider
            reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            useEnterprise={true}
          >
            {children}
          </GoogleReCaptchaProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};
