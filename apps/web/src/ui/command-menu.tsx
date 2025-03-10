"use client";

import { DialogDescription, type DialogProps } from "@kkhys/ui";
import { DialogTitle } from "@kkhys/ui";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  cn,
  useTheme,
} from "@kkhys/ui";
import type { Route } from "next";
import { fisherYatesShuffle, getPublicSearchItems } from "#/utils/post";

const CommandMenuButton = (props: React.ComponentProps<"button">) => (
  <Button
    variant="outline"
    className={cn(
      "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
    )}
    {...props}
  >
    <span className="hidden lg:inline-flex">Search...</span>
    <span className="inline-flex lg:hidden">Search...</span>
    <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
      <span className="text-xs">⌘</span>K
    </kbd>
  </Button>
);

export const CommandMenu = ({ ...props }: DialogProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchItems = React.useMemo(() => {
    return [
      {
        title: "Posts",
        items: fisherYatesShuffle(getPublicSearchItems()),
      },
    ];
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandMenuButton onClick={() => setOpen(true)} {...props} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search for kkhys.me
        </DialogDescription>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchItems.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() =>
                    runCommand(() => router.push(item.href as Route))
                  }
                >
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{ __html: item.emojiSvg }}
                    className="mr-1.5 [&>svg>path]:fill-foreground"
                  />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
