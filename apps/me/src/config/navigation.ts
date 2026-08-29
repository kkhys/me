import { me } from "#/config/site";

export type NavItem = {
  label: string;
  href: string;
  isExternal: boolean;
};

// No "Home" item: the site name pinned to the top-left (breadcrumb) is the
// home link, so listing it here would duplicate that role.
export const navItems = [
  {
    label: "Blog",
    href: "/blog",
    isExternal: false,
  },
  {
    label: "About",
    href: "/about",
    isExternal: false,
  },
  {
    label: "Memo",
    href: me.memo,
    isExternal: true,
  },
  {
    label: "Diary",
    href: me.diary,
    isExternal: true,
  },
  {
    label: "Art",
    href: me.art,
    isExternal: true,
  },
  {
    label: "GitHub",
    href: me.github.url,
    isExternal: true,
  },
] as const satisfies NavItem[];
