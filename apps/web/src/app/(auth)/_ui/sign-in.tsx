"use client";

import { SignIn as ClerkSignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

export const SignIn = () => {
  const { theme = "system" } = useTheme();

  return (
    <ClerkSignIn
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      fallback={<Skeleton className="w-[400px] h-[270px] rounded-xl" />}
      waitlistUrl="/waitlist"
    />
  );
};
