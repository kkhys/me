import { type ReactNode } from 'react';
import clsx from 'clsx';

export const Prose = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx(className, 'prose dark:prose-invert')}>{children}</div>
  );
};
