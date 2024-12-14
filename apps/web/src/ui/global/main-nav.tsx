"use client";

import { cn } from "@kkhys/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "#/ui/global";

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="size-5 rounded-md" />
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/posts"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/posts" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Blog
        </Link>
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/contact" ? "text-foreground" : "text-foreground/80",
          )}
        >
          Contact
        </Link>
      </nav>
    </div>
  );
};
