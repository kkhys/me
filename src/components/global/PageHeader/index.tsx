import clsx from 'clsx';
import React from 'react';
import { Heading } from '^/elements';
import type { FC, ReactNode } from 'react';

type PageHeaderProps = {
  children: ReactNode;
  className: string;
  heading: string;
  variant: 'default';
  [key: string]: any;
};

export const PageHeader: FC<Partial<PageHeaderProps>> = ({
  children,
  className,
  heading,
  variant = 'default',
  ...props
}) => {
  const variants: Record<string, string> = {
    default: 'grid w-full gap-8 py-8 lg:py-12 justify-items-start',
  };

  const styles = clsx(variants[variant], className);

  return (
    <header {...props} className={styles}>
      {heading && (
        <Heading as='h1' width='narrow' size='heading' className='inline-block'>
          {heading}
        </Heading>
      )}
      {children}
    </header>
  );
};
