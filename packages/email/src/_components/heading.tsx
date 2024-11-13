import * as React from 'react';
import { Heading as _Heading } from '@react-email/components';

export const Heading = ({ children }: { children: React.ReactNode }) => (
  <_Heading className='mb-[12px] mt-[24px] text-[18px] font-bold text-gray-900'>
    {children}
  </_Heading>
);
