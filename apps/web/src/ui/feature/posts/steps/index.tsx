import * as React from 'react';

import { cn } from '#/lib/shadcn-ui/utils';

export const Step = ({ className, children, ...props }: React.ComponentProps<'h3'>) => (
  <h3 className={cn('mt-8', className)} {...props}>
    {children}
  </h3>
);

export const Steps = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]', className)} {...props} />
);
