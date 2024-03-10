import * as React from 'react';

const Dots = () => (
  <div className='flex justify-center gap-x-5 py-8'>
    {Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className='bg-primary size-0.5 rounded-full' />
    ))}
  </div>
);

export const Footnotes = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div id='footnotes' className={className}>
    <Dots />
    {children}
  </div>
);
