import clsx from 'clsx';
import React from 'react';
import { Heading } from '^/elements';
import type { FC, ReactNode } from 'react';

type PageHeaderProps = {
  children: ReactNode;
  className: string;
  heading: string;
  variant: 'default' | 'allCollections';
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
    default: 'grid w-full gap-8 p-6 py-8 md:p-8 lg:p-12 justify-items-start',
    allCollections:
      'flex justify-between items-baseline gap-8 p-6 md:p-8 lg:p-12',
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
