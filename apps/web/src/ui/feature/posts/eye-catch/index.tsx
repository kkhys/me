import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '#/lib/shadcn-ui/utils';

const eyeCatchVariants = cva(
  'font-emoji bg-secondary text-secondary-foreground inline-flex select-none items-center justify-center rounded-md shadow-sm',
  {
    variants: {
      size: {
        default: 'size-10 text-xl',
        sm: 'size-8 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export const EyeCatch = ({
  emoji,
  className,
  size,
}: { emoji: string; className?: string } & VariantProps<typeof eyeCatchVariants>) => (
  <span className={cn(eyeCatchVariants({ size }), className)}>{emoji}</span>
);
