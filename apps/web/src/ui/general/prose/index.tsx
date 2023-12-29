import * as React from 'react';
import clsx from 'clsx';

export const Prose = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => (
  <div className={clsx(className, 'prose dark:prose-invert')} {...props} />
);
