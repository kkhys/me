export const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: string | undefined;
  size?: string | undefined;
  className?: string | undefined;
} = {}): string =>
  [
    "btn",
    variant !== "default" && `btn--${variant}`,
    size !== "default" && `btn--size-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
