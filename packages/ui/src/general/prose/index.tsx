import { cn } from "@kkhys/ui";

export const Prose = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn(className, "prose dark:prose-invert")} {...props} />
);
