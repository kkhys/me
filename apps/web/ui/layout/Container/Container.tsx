import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';

export const OuterContainer = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(function OuterContainer({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
      <div className='mx-auto max-w-6xl lg:px-8'>{children}</div>
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
      className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className='mx-auto w-full max-w-2xl'>{children}</div>
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
