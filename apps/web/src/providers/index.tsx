import { ThemeProvider } from "@kkhys/ui/theme";
import { TooltipProvider } from "@kkhys/ui/tooltip";

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
