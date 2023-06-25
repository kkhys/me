import { type ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { ArrowIcon } from '#/ui';

const variantStyles = {
  primary:
    'rounded-full bg-gray-900 py-1 px-3 text-white hover:bg-gray-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300',
  secondary:
    'rounded-full bg-gray-100 py-1 px-3 text-gray-900 hover:bg-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:ring-1 dark:ring-inset dark:ring-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-300',
  filled:
    'rounded-full bg-gray-900 py-1 px-3 text-white hover:bg-gray-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400',
  outline:
    'rounded-full py-1 px-3 text-gray-700 ring-1 ring-inset ring-gray-900/10 hover:bg-gray-900/2.5 hover:text-gray-900 dark:text-gray-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white',
  text: 'text-emerald-500 no-underline hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500',
} as const;

// TODO: props の型を定義する。
export const Button = ({
  variant = 'primary',
  className,
  children,
  arrow,
  href,
}: {
  variant?: keyof typeof variantStyles;
  className?: string;
  children: ReactNode;
  arrow?: 'left' | 'right';
  href?: string;
}) => {
  const Component = href ? Link : 'button';

  className = clsx(
    'inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition',
    variantStyles[variant],
    className,
  );

  const arrowIcon = (
    <ArrowIcon
      className={clsx(
        'mt-0.5 h-5 w-5',
        variant === 'text' && 'relative top-px',
        arrow === 'left' && '-ml-1 rotate-180',
        arrow === 'right' && '-mr-1',
      )}
    />
  );

  return (
    <Component className={className} href={href}>
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </Component>
  );
};
