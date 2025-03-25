"use client";

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "@kkhys/ui/skeleton";
import { useTheme } from "@kkhys/ui/theme";

export const UserProfile = () => {
  const { theme = "system" } = useTheme();

  return (
    <ClerkUserProfile
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      fallback={<Skeleton className="w-full h-[704px] rounded-xl" />}
    />
  );
};
