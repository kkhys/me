"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { Button } from "./button";

const ModeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ThemeProvider, useTheme, ModeSwitcher };
