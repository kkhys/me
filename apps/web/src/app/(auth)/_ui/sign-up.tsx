"use client";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

export const SignUp = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="w-[400px] h-[295px] rounded-xl" />;
  }

  return (
    <ClerkSignUp
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    />
  );
};
