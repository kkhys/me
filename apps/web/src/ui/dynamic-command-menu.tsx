"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { CommandMenuButton } from "#/ui";

export const DynamicCommandMenu = dynamic(
  () => import("#/ui").then(({ CommandMenu }) => CommandMenu),
  {
    ssr: false,
    loading: () => <CommandMenuButton />,
  },
);
