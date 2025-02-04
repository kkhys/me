import { cn } from "@kkhys/ui";

const DescriptionList = ({
  className,
  ...props
}: React.ComponentProps<"dl">) => (
  <dl
    className={cn(
      className,
      "grid grid-cols-1 text-sm sm:grid-cols-[min(50%,20rem)_auto]",
    )}
    {...props}
  />
);
DescriptionList.displayName = "DescriptionList";

const DescriptionTerm = ({
  className,
  ...props
}: React.ComponentProps<"dt">) => (
  <dt
    className={cn(
      className,
      "col-start-1 border-t border-border/50 pt-3 text-muted-foreground first:border-none sm:first:border-solid sm:border-t sm:py-3",
    )}
    {...props}
  />
);
DescriptionTerm.displayName = "DescriptionTerm";

const DescriptionDetails = ({
  className,
  ...props
}: React.ComponentProps<"dd">) => (
  <dd
    className={cn(
      className,
      "pt-1 pb-3 text-foreground sm:border-t sm:border-border/50 sm:py-3 sm:nth-2:border-none",
    )}
    {...props}
  />
);
DescriptionDetails.displayName = "DescriptionDetails";

export { DescriptionList, DescriptionTerm, DescriptionDetails };
