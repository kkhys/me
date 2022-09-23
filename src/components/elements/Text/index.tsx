import clsx from 'clsx';
import React from 'react';
import { missingClass } from '@/lib';
import type { ElementType, FC, ReactNode } from 'react';

type TextProps = {
  as?: ElementType;
  className?: string;
  color?: 'default' | 'primary' | 'subtle' | 'contrast';
  size?: 'lead' | 'copy' | 'fine';
  width?: 'default' | 'narrow' | 'wide';
  children: ReactNode;
  [key: string]: any;
};

export const Text: FC<TextProps> = ({
  as: Component = 'span',
  className,
  color = 'default',
  size = 'copy',
  width = 'default',
  children,
  ...props
}) => {
  const colors: Record<string, string> = {
    default: 'inherit',
    primary: 'text-primary/90 dark:text-contrast/90',
    subtle: 'text-contrast/50 dark:text-primary/50',
    contrast: 'text-contrast/90 dark:text-primary/90',
  };

  const sizes: Record<string, string> = {
    lead: 'text-lead font-medium',
    copy: 'text-copy',
    fine: 'text-fine subpixel-antialiased',
  };

  const widths: Record<string, string> = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'text-') && colors[color],
    sizes[size],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {children}
    </Component>
  );
};
