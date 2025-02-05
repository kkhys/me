"use client";

import { CodeIcon, Share2Icon, SquareArrowOutUpRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
  toast,
} from "@kkhys/ui";
import type { Photo, Post } from "contentlayer/generated";
import { siteConfig } from "#/config";

const NavLink = <T extends string>({
  href,
  children,
  isExternal = false,
}: {
  href: Route<T>;
  children: React.ReactNode;
  isExternal?: boolean;
}) => (
  <DropdownMenuItem asChild>
    <Link
      href={href}
      className="cursor-pointer"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {children}
      {isExternal && <SquareArrowOutUpRightIcon className="size-2" />}
    </Link>
  </DropdownMenuItem>
);

const generateXShareLink = (url: string, title: string) =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`${title} | ${siteConfig.name}`)}`;

const generateFacebookShareLink = (url: string) =>
  `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;

const generateHatebuSaveLink = (url: string, title: string) =>
  `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}&title=${title} | ${siteConfig.name}`;

const handleCopyLink = (url: string) =>
  void window.navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Link copied."));

const SharedAction = <T extends Photo | Post>({
  title,
  url,
}: Pick<T, "url"> & { title: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Share2Icon className="size-4" />
        <span className="sr-only">Share</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="font-sans">
      <DropdownMenuItem asChild>
        <button
          type="button"
          className="w-full cursor-pointer"
          onClick={() => handleCopyLink(url)}
        >
          Copy link
        </button>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <NavLink href={generateXShareLink(url, title) as Route} isExternal>
        Share on X
      </NavLink>
      <NavLink href={generateFacebookShareLink(url) as Route} isExternal>
        Share on Facebook
      </NavLink>
      <NavLink href={generateHatebuSaveLink(url, title) as Route} isExternal>
        Save in Hatena Bookmark
      </NavLink>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ConfigAction = <T extends Photo | Post>({
  editUrl,
  sourceUrl,
  revisionHistoryUrl,
}: Pick<T, "editUrl" | "sourceUrl" | "revisionHistoryUrl">) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <CodeIcon className="size-4" />
        <span className="sr-only">Report</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="font-sans">
      <NavLink href={editUrl as Route} isExternal>
        Edit the page on GitHub
      </NavLink>
      <NavLink href="https://github.com/kkhys/me/issues/new" isExternal>
        Report the content issue
      </NavLink>
      <NavLink href={sourceUrl as Route} isExternal>
        View the source on GitHub
      </NavLink>
      <NavLink href={revisionHistoryUrl as Route} isExternal>
        View the revision history
      </NavLink>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const ActionController = ({
  data,
  title,
  className,
}: {
  data: Post | Photo;
  title: string;
  className?: string;
}) => (
  <div className={cn("flex justify-end gap-x-1", className)}>
    <ConfigAction {...data} />
    <SharedAction {...data} title={title} />
  </div>
);
