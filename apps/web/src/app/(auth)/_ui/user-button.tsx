"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "@kkhys/ui/skeleton";
import { useTheme } from "@kkhys/ui/theme";

export const UserButton = () => {
  const { theme = "system" } = useTheme();

  return (
    <ClerkUserButton
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      userProfileUrl="/user-profile"
      fallback={<Skeleton className="size-[28px] rounded-full" />}
    />
  );
};
