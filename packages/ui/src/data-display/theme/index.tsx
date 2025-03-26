"use client";

import { Button } from "@kkhys/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import React from "react";

const ModeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="group/toggle size-8"
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ThemeProvider, useTheme, ModeSwitcher };
