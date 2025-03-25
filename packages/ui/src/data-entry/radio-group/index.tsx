import {
  type FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";
import { FormItem } from "@kkhys/ui/form";
import { Label } from "@kkhys/ui/label";
import React from "react";
import { _RadioGroup, _RadioGroupItem } from "./_radio-group";

export const RadioGroup = ({
  meta,
  items,
}: {
  meta: FieldMetadata<string>;
  items: { value: string; label: string }[];
}) => {
  const radioGroupRef =
    React.useRef<React.ComponentRef<typeof _RadioGroup>>(null);
  const control = useControl(meta);

  return (
    <>
      <input
        ref={control.register}
        name={meta.name}
        defaultValue={meta.initialValue}
        tabIndex={-1}
        className="sr-only"
        onFocus={() => radioGroupRef.current?.focus()}
        id={meta.id}
      />
      <_RadioGroup
        ref={radioGroupRef}
        className="flex flex-col space-y-2"
        value={control.value ?? ""}
        onValueChange={control.change}
        onBlur={control.blur}
      >
        {items.map(({ value, label }) => (
          <FormItem
            className="flex items-center space-x-3 space-y-0"
            key={value}
          >
            <_RadioGroupItem value={value} id={`${meta.id}-${value}`} />
            <Label htmlFor={`${meta.id}-${value}`}>{label}</Label>
          </FormItem>
        ))}
      </_RadioGroup>
    </>
  );
};
