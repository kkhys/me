import React from 'react';

import '#/styles/tailwind.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body>{children}</body>
    </html>
  );
}
