import clsx from 'clsx';
import React from 'react';
import { missingClass } from '@/lib';
import { Heading } from '^/elements';
import type { ElementType, FC, ReactNode } from 'react';

type SectionProps = {
  as: ElementType;
  children: ReactNode;
  className: string;
  divider: 'none' | 'top' | 'bottom' | 'both';
  display: 'grid' | 'flex';
  heading: string;
  padding: 'x' | 'y' | 'all' | 'none';
  [key: string]: any;
};

export const Section: FC<Partial<SectionProps>> = ({
  as: Component = 'section',
  children,
  className,
  divider = 'none',
  display = 'grid',
  heading,
  padding = 'none',
  ...props
}) => {
  const paddings = {
    x: 'px-6 md:px-8 lg:px-12',
    y: 'py-6 md:py-8 lg:py-12',
    all: 'p-6 md:p-8 lg:p-12',
    none: 'p-0',
  };

  const dividers = {
    none: 'border-none',
    top: 'border-t border-primary/05',
    bottom: 'border-b border-primary/05',
    both: 'border-y border-primary/05',
  };

  const displays = {
    flex: 'flex',
    grid: 'grid',
  };

  const styles = clsx(
    'w-full gap-4 md:gap-8',
    displays[display],
    missingClass(className, '\\mp[xy]?-') && paddings[padding],
    dividers[divider],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {heading && (
        <Heading size='lead' className={padding === 'y' ? paddings.x : ''}>
          {heading}
        </Heading>
      )}
      {children}
    </Component>
  );
};
