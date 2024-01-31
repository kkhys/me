'use client';

import * as React from 'react';

import { cn } from '#/lib/shadcn-ui/utils';

export const MermaidBlock = ({
  className,
  ...props
}: { className?: string } & React.ComponentPropsWithoutRef<'svg'>) => {
  if (!props.id?.includes('mermaid')) return <svg {...props} />;

  return (
    <div
      className={cn(
        'flex justify-center overflow-hidden rounded-md bg-[#131316] p-6 leading-[1.1rem] shadow-md dark:border',
        className,
      )}
    >
      <svg className='w-full' {...props} />
    </div>
  );
};
