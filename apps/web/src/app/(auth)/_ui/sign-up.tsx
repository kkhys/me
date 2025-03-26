"use client";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "@kkhys/ui/skeleton";
import { useTheme } from "@kkhys/ui/theme";

export const SignUp = () => {
  const { theme = "system" } = useTheme();

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
