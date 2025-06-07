import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { siteConfig } from "#/config/site";
import { Button } from "./button";
import { NavLink } from "./nav-link";

const generateXShareLink = (url: string, title: string) =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`${title} | ${siteConfig.title}`)}`;

const generateFacebookShareLink = (url: string) =>
  `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;

const generateHatebuSaveLink = (url: string, title: string) =>
  `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}&title=${title} | ${siteConfig.title}`;

const handleCopyLink = (url: string) =>
  void window.navigator.clipboard
    .writeText(url)
    .then(() => toast.success("クリップボードに URL をコピーしました"));

export const SharedMenu = ({ title, url }: { title: string; url: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Share2Icon className="size-4" />
        <span className="sr-only">コンテンツを共有</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="font-sans">
      <DropdownMenuItem asChild>
        <button
          type="button"
          className="w-full cursor-pointer"
          onClick={() => handleCopyLink(url)}
        >
          URL をコピー
        </button>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <NavLink href={generateXShareLink(url, title)} isExternal>
          X で共有
        </NavLink>
        <NavLink href={generateFacebookShareLink(url)} isExternal>
          Facebook で共有
        </NavLink>
        <NavLink href={generateHatebuSaveLink(url, title)} isExternal>
          はてなブックマークに保存
        </NavLink>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
