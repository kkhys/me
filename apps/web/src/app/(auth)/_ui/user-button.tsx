"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

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
