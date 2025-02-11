"use client";

import { SignIn as ClerkSignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton, useTheme } from "@kkhys/ui";
import React from "react";

export const SignIn = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="w-[400px] h-[450px] rounded-xl" />;
  }

  return (
    <ClerkSignIn
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    />
  );
};
