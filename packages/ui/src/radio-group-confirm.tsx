import {
  type FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";
import * as React from "react";
import { FormItem } from "./form";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

export const RadioGroupConform = ({
  meta,
  items,
}: {
  meta: FieldMetadata<string>;
  items: { value: string; label: string }[];
}) => {
  const radioGroupRef = React.useRef<React.ElementRef<typeof RadioGroup>>(null);
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
      />
      <RadioGroup
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
            <RadioGroupItem value={value} id={`${meta.id}-${value}`} />
            <Label htmlFor={`${meta.id}-${value}`}>{label}</Label>
          </FormItem>
        ))}
      </RadioGroup>
    </>
  );
};
