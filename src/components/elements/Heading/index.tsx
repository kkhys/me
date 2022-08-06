import clsx from 'clsx';
import React from 'react';
import { missingClass } from '@/lib';
import type { ElementType, FC, HTMLAttributes, ReactNode } from 'react';

type HeadingProps = {
  as?: ElementType;
  size?: 'display' | 'heading' | 'lead' | 'copy';
  width?: 'default' | 'narrow' | 'wide';
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

export const Heading: FC<HeadingProps> = ({
  as: Component = 'h2',
  className = '',
  size = 'heading',
  width = 'default',
  children,
  ...props
}) => {
  const sizes = {
    display: 'font-bold text-display',
    heading: 'font-bold text-heading',
    lead: 'font-bold text-lead',
    copy: 'font-medium text-copy',
  };

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'font-') && sizes[size],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {children}
    </Component>
  );
};
