import type { Route } from "next";
import { categories } from "#/config/category";

type MainNavItem = {
  title: string;
  href: Route;
};

type SidebarNavItem = {
  title: string;
  href?: Route;
  items?: SidebarNavItem[];
};

type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export const docsConfig = {
  mainNav: [
    {
      title: "Blog",
      href: "/posts",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  sidebarNav: [
    {
      title: "Category",
      items: categories.map(({ title, slug }) => ({
        title,
        href: `/posts/categories/${slug}` as Route,
      })),
    },
  ],
} satisfies DocsConfig;
