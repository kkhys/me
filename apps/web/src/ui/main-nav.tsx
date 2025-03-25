"use client";

import { cn } from "@kkhys/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "#/config/docs";
import { Icons } from "#/ui/icons";

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="size-5 rounded-md" />
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {docsConfig.mainNav.map(({ title, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === href ? "text-foreground" : "text-foreground/80",
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
    </div>
  );
};
