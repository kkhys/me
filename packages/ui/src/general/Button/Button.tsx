import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { forwardRef } from 'react';

import clsx from 'clsx';

import { Spin } from '#/feedback';

const variants = {
  primary: 'ui-bg-blue-600 ui-text-white',
  inverse: 'ui-bg-white ui-text-blue-600',
  danger: 'ui-bg-red-600 ui-text-white',
};

const sizes = {
  sm: 'ui-py-2 ui-px-4 ui-text-sm',
  md: 'ui-py-2 ui-px-6 ui-text-md',
  lg: 'ui-py-3 ui-px-8 ui-text-lg',
};

type IconProps =
  | {
      /**
       * TODO: startIcon description
       */
      startIcon: ReactElement;
      /**
       * TODO: endIcon description
       */
      endIcon?: never;
    }
  | { endIcon: ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * TODO: variant description
   */
  variant?: keyof typeof variants;
  /**
   * TODO: size description
   */
  size?: keyof typeof sizes;
  /**
   * TODO: isLoading description
   */
  isLoading?: boolean;
  /**
   * TODO: children description
   */
  children?: string;
} & IconProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          'ui-flex ui-items-center ui-justify-center ui-rounded-md ui-border ui-border-gray-300 ui-font-medium ui-shadow-sm hover:ui-opacity-80 focus:ui-outline-none disabled:ui-cursor-not-allowed disabled:ui-opacity-70',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Spin size='sm' className='ui-text-current' />}
        {!isLoading && startIcon}
        <span className='mx-2'>{props.children}</span> {!isLoading && endIcon}
      </button>
    );
  },
);
