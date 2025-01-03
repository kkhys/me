"use client";

import { ScrollArea, ScrollBar, cn } from "@kkhys/ui";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "#/config";

export const CategoryNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          <Link
            href="/posts"
            className={cn(
              "flex h-7 items-center justify-center rounded-full px-4 text-center font-sans text-sm transition-colors hover:text-primary",
              pathname === "/posts" || pathname.startsWith("/posts/page")
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground",
            )}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              href={`/posts/categories/${category.slug}` as Route}
              key={category.title}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center font-sans text-sm transition-colors hover:text-primary",
                pathname?.startsWith(`/posts/categories/${category.slug}`)
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {category.title}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};
