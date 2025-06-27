import type { InferEntrySchema } from "astro:content";
import { CodeIcon } from "lucide-react";
import { Button } from "#/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { siteConfig } from "#/config/site";
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
          <NavLink
            href={editUrl}
            isExternal
            umamiEvent="github-edit-click"
            umamiLocation="blog-developer-menu"
          >
            GitHub で編集する
          </NavLink>
        )}
        <NavLink
          href={`${siteConfig.github.content}/issues/new`}
          isExternal
          umamiEvent="github-issue-click"
          umamiLocation="blog-developer-menu"
        >
          記事の問題を報告する
        </NavLink>
        {sourceUrl && (
          <NavLink
            href={sourceUrl}
            isExternal
            umamiEvent="github-source-click"
            umamiLocation="blog-developer-menu"
          >
            ソースコードを表示する
          </NavLink>
        )}
        {revisionHistoryUrl && (
          <NavLink
            href={revisionHistoryUrl}
            isExternal
            umamiEvent="github-history-click"
            umamiLocation="blog-developer-menu"
          >
            変更履歴を表示する
          </NavLink>
        )}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
