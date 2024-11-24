"use client";

import { ThemeProvider, TooltipProvider } from "@kkhys/ui";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "#/env";

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <TooltipProvider delayDuration={0}>
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        useEnterprise={true}
      >
        {children}
      </GoogleReCaptchaProvider>
    </TooltipProvider>
  </ThemeProvider>
);
