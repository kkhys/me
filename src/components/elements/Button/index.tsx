import clsx from 'clsx';
import { Link } from 'gatsby';
import React from 'react';
import { missingClass } from '@/lib';
import type { ElementType, FC } from 'react';

type ButtonProps = {
  as: ElementType;
  className: string;
  variant: 'primary' | 'secondary' | 'inline';
  width: 'auto' | 'full';
  [key: string]: any;
};

export const Button: FC<Partial<ButtonProps>> = ({
  as = 'button',
  className = '',
  variant = 'primary',
  width = 'auto',
  ...props
}) => {
  const Component = props?.to ? Link : as;

  const baseButtonClasses =
    'inline-block py-3 px-6 font-medium text-center rounded';

  const variants = {
    primary: `${baseButtonClasses} bg-primary text-contrast`,
    secondary: `${baseButtonClasses} border border-primary/10 bg-contrast text-primary`,
    inline: 'pb-1 leading-none border-b border-primary/10',
  };

  const widths = {
    auto: 'w-auto',
    full: 'w-full',
  };

  const styles = clsx(
    missingClass(className, 'bg-') && variants[variant],
    missingClass(className, 'w-') && widths[width],
    className,
  );

  return <Component className={styles} {...props} />;
};
