import type { InferEntrySchema } from "astro:content";
import { CodeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { siteConfig } from "#/config/site";
import { Button } from "./button";
import { NavLink } from "./nav-link";

export const ConfigMenu = ({
  editUrl,
  sourceUrl,
  revisionHistoryUrl,
}: Pick<
  InferEntrySchema<"blog">,
  "editUrl" | "sourceUrl" | "revisionHistoryUrl"
>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <CodeIcon className="size-4" />
        <span className="sr-only">開発者用メニュー</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>開発者向け</DropdownMenuLabel>
      <DropdownMenuGroup>
        {editUrl && (
          <NavLink href={editUrl} isExternal>
            GitHub で編集する
          </NavLink>
        )}
        <NavLink href={`${siteConfig.github.content}/issues/new`} isExternal>
          問題を報告する
        </NavLink>
        {sourceUrl && (
          <NavLink href={sourceUrl} isExternal>
            ソースコードを表示する
          </NavLink>
        )}
        {revisionHistoryUrl && (
          <NavLink href={revisionHistoryUrl} isExternal>
            変更履歴を表示する
          </NavLink>
        )}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
