import React from 'react';

import { cn } from '#/utils';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />
);

export { Skeleton };