"use client";

import { Waitlist as ClerkWaitlist } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

export const Waitlist = () => {
  const { theme } = useTheme();

  return (
    <ClerkWaitlist
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      fallback={<Skeleton className="w-[400px] h-[370px] rounded-xl" />}
    />
  );
};
