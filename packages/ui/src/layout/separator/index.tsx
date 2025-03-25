"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@kkhys/ui/utils";

const Separator = ({
  className,
  decorative,
  orientation = "horizontal",
  ref,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
