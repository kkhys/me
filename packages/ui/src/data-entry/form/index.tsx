"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import React from "react";

import { type FieldName, FormProvider, useField } from "@conform-to/react";
import { Label } from "@kkhys/ui/label";
import { cn } from "@kkhys/ui/utils";

const Form = FormProvider;

const FormFieldContext = React.createContext<{ name: FieldName<string> }>(
  {} as { name: FieldName<string> },
);

const FormField = <TFieldName extends string>({
  name,
  render,
}: {
  name: TFieldName;
  render: () => React.ReactNode;
}) => <FormFieldContext value={{ name }}>{render()}</FormFieldContext>;

const FormItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={cn("space-y-2", className)} {...props}>
    {children}
  </div>
);
FormItem.displayName = "FormItem";

const FormLabel = ({
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  const { name } = React.useContext(FormFieldContext);
  const [{ id, required }] = useField(name);

  return (
    <Label htmlFor={id} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-label="required">
          *
        </span>
      )}
    </Label>
  );
};
FormLabel.displayName = "FormLabel";

const FormDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { name } = React.useContext(FormFieldContext);
  const [{ descriptionId }] = useField(name);

  return (
    <p
      id={descriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
};
FormDescription.displayName = "FormDescription";

const FormMessage = ({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) => {
  const { name } = React.useContext(FormFieldContext);
  const [{ errors, errorId }] = useField(name);
  const body = errors ? String(errors[0]) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={errorId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
};
FormMessage.displayName = "FormMessage";

export { Form, FormItem, FormLabel, FormDescription, FormMessage, FormField };
