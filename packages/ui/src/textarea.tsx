import { getTextareaProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { cn } from "@kkhys/ui";

const Textarea = ({
  meta,
  className,
  ref,
  ...props
}: { meta: FieldMetadata<string> } & React.ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    ref={ref}
    {...getTextareaProps(meta)}
    {...props}
  />
);
Textarea.displayName = "Textarea";

export { Textarea };
