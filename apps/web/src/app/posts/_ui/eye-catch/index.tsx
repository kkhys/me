import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { Skeleton } from "@kkhys/ui/skeleton";
import { cn } from "@kkhys/ui/utils";

const eyeCatchVariants = cva(
  "inline-flex select-none items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm",
  {
    variants: {
      size: {
        default: "size-10",
        sm: "size-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const svgVariants = cva("[&>svg>path]:fill-foreground", {
  variants: {
    size: {
      default: "[&>svg]:size-5",
      sm: "[&>svg]:size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type EyeCatchProps = {
  emoji: string;
  className?: string;
} & VariantProps<typeof eyeCatchVariants>;

export const EyeCatch = ({ emoji, className, size }: EyeCatchProps) => {
  return (
    <span className={cn(eyeCatchVariants({ size }), className)}>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: emoji }}
        className={svgVariants({ size })}
      />
    </span>
  );
};

export const EyeCatchSkeleton = ({
  size,
  className,
}: Omit<EyeCatchProps, "emoji">) => (
  <Skeleton className={cn(eyeCatchVariants({ size }), className)} />
);
