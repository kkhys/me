import '#/styles/globals.css';

import type { ReactNode } from 'react';

export const metadata = {
  title: 'admin',
  description: '',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='ja'>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
