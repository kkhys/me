"use client";

import isValidProp from "@emotion/is-prop-valid";
import { ThemeProvider } from "@kkhys/ui/theme";
import { TooltipProvider } from "@kkhys/ui/tooltip";
import { MotionConfig, useReducedMotion } from "motion/react";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig
        transition={shouldReduceMotion ? { duration: 0 } : undefined}
        isValidProp={isValidProp}
      >
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
};
