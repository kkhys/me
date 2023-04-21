import clsx from 'clsx';

const sizes = {
  sm: 'ui-h-4 ui-w-4',
  md: 'ui-h-8 ui-w-8',
  lg: 'ui-h-16 ui-w-16',
  xl: 'ui-h-24 ui-w-24',
};

const variants = {
  light: 'ui-text-white',
  primary: 'ui-text-blue-600',
};

type SpinProps = {
  /**
   * The size of Spin, options:
   */
  size?: keyof typeof sizes;
  /**
   * TODO: variant description
   */
  variant?: keyof typeof variants;
  /**
   * TODO: className description
   */
  className?: string;
};

export const Spin = ({ size = 'md', variant = 'primary', className = '' }: SpinProps) => {
  return (
    <>
      <svg
        className={clsx('ui-animate-spin', sizes[size], variants[variant], className)}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        data-testid='loading'
      >
        <circle
          className='ui-opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='ui-opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
      <span className='ui-sr-only'>Loading</span>
    </>
  );
};
