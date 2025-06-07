import { MoveUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DropdownMenuItem } from "#/components/ui/dropdown-menu.tsx";

export const NavLink = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
}) => (
  <DropdownMenuItem asChild>
    <a
      href={href}
      className="cursor-pointer"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {children}
      {isExternal && <MoveUpRightIcon className="size-3 stroke-foreground" />}
    </a>
  </DropdownMenuItem>
);
