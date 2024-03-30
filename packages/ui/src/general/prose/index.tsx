import * as React from 'react';

import { cn } from '../../utils';

export const Prose = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => (
  <div className={cn(className, 'prose dark:prose-invert')} {...props} />
);
