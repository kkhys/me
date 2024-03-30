import * as React from 'react';
import clsx from 'clsx';

export const ContainerOuter = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  function OuterContainer({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
        <div className='mx-auto w-full max-w-6xl lg:px-8'>{children}</div>
      </div>
    );
  },
);

export const ContainerInner = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  function InnerContainer({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx('px-4 sm:px-8 lg:px-12 xl:relative', className)} {...props}>
        <div className='mx-auto max-w-2xl'>{children}</div>
      </div>
    );
  },
);

export const Container = React.forwardRef<
  React.ElementRef<typeof ContainerOuter>,
  React.ComponentPropsWithoutRef<typeof ContainerOuter>
>(function Container({ children, ...props }, ref) {
  return (
    <ContainerOuter ref={ref} {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  );
});
