"use client";

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
      >
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
};
