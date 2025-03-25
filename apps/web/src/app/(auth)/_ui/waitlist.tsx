"use client";

import { Waitlist as ClerkWaitlist } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "@kkhys/ui/skeleton";
import { useTheme } from "@kkhys/ui/theme";

export const Waitlist = () => {
  const { theme = "system" } = useTheme();

  return (
    <ClerkWaitlist
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      fallback={<Skeleton className="w-[400px] h-[370px] rounded-xl" />}
    />
  );
};
