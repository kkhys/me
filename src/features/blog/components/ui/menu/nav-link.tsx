import { MoveUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DropdownMenuItem } from "#/components/ui/dropdown-menu.tsx";

export const NavLink = ({
  href,
  children,
  isExternal = false,
  umamiEvent,
  umamiLocation,
}: {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
  umamiEvent?: string;
  umamiLocation?: string;
}) => (
  <DropdownMenuItem asChild>
    <a
      href={href}
      className="cursor-pointer"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      data-umami-event={umamiEvent}
      data-umami-event-location={umamiLocation}
    >
      {children}
      {isExternal && <MoveUpRightIcon className="size-3 stroke-foreground" />}
    </a>
  </DropdownMenuItem>
);
