import * as React from 'react';

export const EyeCatch = ({ emoji }: { emoji: string }) => (
  <span className='font-emoji bg-secondary text-secondary-foreground inline-flex h-10 w-10 select-none items-center justify-center rounded-md text-xl shadow-sm'>
    {emoji}
  </span>
);
