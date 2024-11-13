import * as React from 'react';

import { cn } from '@kkhys/ui';

export const ContainerOuter = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(function OuterContainer({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('sm:px-8', className)} {...props}>
      <div className='mx-auto w-full max-w-6xl lg:px-8'>{children}</div>
    </div>
  );
});

export const ContainerInner = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(function InnerContainer({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('px-6 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className='relative mx-auto max-w-2xl'>{children}</div>
    </div>
  );
});

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
