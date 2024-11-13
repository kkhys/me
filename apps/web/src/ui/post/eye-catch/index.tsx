'use client';

import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { useTheme } from 'next-themes';

import { cn } from '@kkhys/ui';

const eyeCatchVariants = cva(
  'inline-flex select-none items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm',
  {
    variants: {
      size: {
        default: 'size-10',
        sm: 'size-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const svgVariants = cva('', {
  variants: {
    size: {
      default: 'size-5',
      sm: 'size-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const EyeCatch = ({
  emoji,
  className,
  size,
}: { emoji: string; className?: string } & VariantProps<
  typeof eyeCatchVariants
>) => {
  const { theme, systemTheme } = useTheme();
  const [imageSrc, setImageSrc] = React.useState('');

  React.useEffect(() => {
    const selectedTheme = theme === 'system' ? systemTheme : theme;
    setImageSrc(
      `/api/noto-emoji/${emoji}.svg?theme=${selectedTheme === 'dark' ? 'dark' : 'light'}`,
    );
  }, [theme, systemTheme, emoji]);

  return (
    <span className={cn(eyeCatchVariants({ size }), className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt={emoji} className={cn(svgVariants({ size }))} />
    </span>
  );
};
