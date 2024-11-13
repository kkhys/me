import * as React from 'react';
import { Link as _Link } from '@react-email/components';

export const Link = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => (
  <_Link href={href} className='text-blue-600 no-underline'>
    {children}
  </_Link>
);
