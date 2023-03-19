'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

export const usePrevious = () => {
  const pathname = usePathname();

  let ref = useRef();

  useEffect(() => {
    ref.current = pathname as any; // TODO: any を修正する
  }, [pathname]);

  return { previousPathname: ref.current };
};
