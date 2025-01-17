import { cn } from "@kkhys/ui";

export const Container = ({
  width = "narrow",
  children,
}: {
  width?: "narrow" | "wide";
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "w-full mx-auto flex-1",
      width === "narrow" ? "max-w-2xl" : "max-w-5xl",
    )}
  >
    <div className="container py-12">{children}</div>
  </div>
);
