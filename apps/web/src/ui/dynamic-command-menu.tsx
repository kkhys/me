"use client";

import dynamic from "next/dynamic";
import React from "react";
import { CommandMenuButton } from "#/ui/command-menu";

export const DynamicCommandMenu = dynamic(
  () => import("#/ui/command-menu").then(({ CommandMenu }) => CommandMenu),
  {
    ssr: false,
    loading: () => <CommandMenuButton />,
  },
);
