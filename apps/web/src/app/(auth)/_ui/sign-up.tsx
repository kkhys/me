"use client";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

export const SignUp = () => {
  const { theme } = useTheme();

  return (
    <ClerkSignUp
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      fallback={<Skeleton className="w-[400px] h-[295px] rounded-xl" />}
      waitlistUrl="/waitlist"
    />
  );
};
