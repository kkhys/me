"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import {
  type FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";
import { cn } from "@kkhys/ui";
import * as React from "react";

const Checkbox = ({
  meta,
  className,
  ...props
}: {
  meta: FieldMetadata<string | boolean | undefined>;
} & React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
  const checkboxRef = React.useRef<React.ComponentRef<typeof Checkbox>>(null);
  const control = useControl(meta);

  return (
    <>
      <CheckboxPrimitive.Root
        id={meta.id}
        checked={control.value === "on"}
        onCheckedChange={(checked) => control.change(checked ? "on" : "")}
        onBlur={control.blur}
        className={cn(
          "peer size-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className,
        )}
        ref={checkboxRef}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="size-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <input
        className="sr-only"
        aria-hidden
        ref={control.register}
        name={meta.name}
        tabIndex={-1}
        defaultValue={meta.initialValue}
        onFocus={() => checkboxRef.current?.focus()}
      />
    </>
  );
};
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
