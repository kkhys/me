import { getInputProps } from "@conform-to/react";
import type { FieldMetadata } from "@conform-to/react";
import { cn } from "@kkhys/ui/utils";

const Input = ({
  meta,
  type,
  className,
  ref,
  ...props
}: {
  meta?: FieldMetadata<string>;
  type: Parameters<typeof getInputProps>[1]["type"];
} & React.ComponentProps<"input">) => {
  if (!meta) {
    return (
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }

  const { key, ...inputProps } = getInputProps(meta, {
    type,
    ariaAttributes: true,
  });

  return (
    <input
      key={key}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        meta.errors && "border-destructive focus-visible:ring-destructive/50",
        className,
      )}
      ref={ref}
      {...inputProps}
      {...props}
    />
  );
};
Input.displayName = "Input";

export { Input };
