"use client";

import { ThemeProvider, TooltipProvider } from "@kkhys/ui";

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
  </ThemeProvider>
);
