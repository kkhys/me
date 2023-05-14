import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';

export const OuterContainer = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(function OuterContainer({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={clsx('sm:ui-px-8', className)} {...props}>
      <div className='ui-mx-auto ui-max-w-7xl lg:ui-px-8'>{children}</div>
    </div>
  );
});

export const InnerContainer = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(function InnerContainer({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={clsx('ui-relative ui-px-4 sm:ui-px-8 lg:ui-px-12', className)}
      {...props}
    >
      <div className='ui-bg-gray-1000 ui-mx-auto ui-max-w-2xl lg:ui-max-w-5xl'>
        {children}
      </div>
    </div>
  );
});

export const Container = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; style?: CSSProperties } // TODO: 汎用性がある形にする
>(function Container({ children, ...props }, ref) {
  return (
    <OuterContainer ref={ref} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  );
});
