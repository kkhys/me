"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  cn,
} from "@kkhys/ui";
import { MenuIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { docsConfig } from "#/config";

export const MobileNav = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 size-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerTitle className="sr-only">Menu</DrawerTitle>
      <DrawerDescription className="sr-only">
        Mobile navigation
      </DrawerDescription>
      <DrawerContent className="max-h-[60svh] p-0 font-sans">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            <MobileLink href="/" onOpenChange={setOpen}>
              Home
            </MobileLink>
            {docsConfig.mainNav?.map(
              ({ href, title }) =>
                href && (
                  <MobileLink
                    key={href}
                    href={href as Route}
                    onOpenChange={setOpen}
                  >
                    {title}
                  </MobileLink>
                ),
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map(({ title, items }) => (
                <div key={title} className="flex flex-col space-y-3 pt-6">
                  <h4 className="font-medium">{title}</h4>
                  {items?.length &&
                    items.map(({ title, href }) => (
                      <React.Fragment key={href}>
                        {href ? (
                          <MobileLink
                            href={href}
                            onOpenChange={setOpen}
                            className="text-muted-foreground"
                          >
                            {title}
                          </MobileLink>
                        ) : (
                          title
                        )}
                      </React.Fragment>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
} & LinkProps<string>) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof href === "string") {
          router.push(href);
        }
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
};
