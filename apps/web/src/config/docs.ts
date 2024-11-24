import type { MainNavItem, SidebarNavItem } from "#/types";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/posts",
    },
  ],
  sidebarNav: [
    {
      title: "Blog",
      items: [
        {
          title: "Posts",
          href: "/posts",
          items: [],
        },
      ],
    },
  ],
};
