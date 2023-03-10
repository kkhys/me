import type { ReactNode } from 'react';
import '#/styles/globals.css';

export const metadata = {
  title: 'kkhys.me',
  description: 'Personal website of Keisuke Hayashi.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ja'>
      <body>{children}</body>
    </html>
  );
}
