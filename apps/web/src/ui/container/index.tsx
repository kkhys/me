import { cn } from "@kkhys/ui";

export const Container = ({
  width = "narrow",
  children,
  className,
}: {
  width?: "narrow" | "wide";
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full mx-auto",
      width === "narrow" ? "max-w-2xl" : "max-w-5xl",
      className,
    )}
  >
    <div className="container py-12 mx-auto">{children}</div>
  </div>
);
