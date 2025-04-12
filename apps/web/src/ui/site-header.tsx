import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@kkhys/ui/button";
import { ModeSwitcher } from "@kkhys/ui/theme";
import { LockIcon } from "lucide-react";
import React from "react";
import { UserButton } from "#/app/(auth)/_ui/user-button";
import { CommandMenu } from "#/ui/command-menu";
import { MainNav } from "#/ui/main-nav";
import { MobileNav } from "#/ui/mobile-nav";

export const SiteHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
    <div className="flex h-14 items-center px-4">
      <MainNav />
      <MobileNav />
      <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <nav className="flex items-center gap-1.5">
          <ModeSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
              >
                <LockIcon />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </div>
  </header>
);
