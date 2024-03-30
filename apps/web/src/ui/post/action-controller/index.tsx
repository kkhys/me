'use client';

import type { Post } from 'contentlayer/generated';
import type { Route } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon, CodeIcon, Share1Icon } from '@radix-ui/react-icons';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@kkhys/ui';

import { site } from '#/config';

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
      className='cursor-pointer'
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && <ArrowTopRightIcon className='ml-1 size-3' />}
    </Link>
  </DropdownMenuItem>
);

const generateXShareLink = (url: string, title: string) =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${site.url.base}${url}`)}&title=${encodeURIComponent(`${title} | ${site.title}`)}`;

const generateFacebookShareLink = (url: string) =>
  `https://www.facebook.com/sharer.php?u=${encodeURIComponent(`${site.url.base}${url}`)}`;

const generateHatebuSaveLink = (url: string, title: string) =>
  `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(`${site.url.base}${url}`)}&title=${title} | ${site.title}`;

/**
 * Copies a given URL to the clipboard and displays a success toast message.
 *
 * @param url - The URL to be copied.
 */
const handleCopyLink = (url: string) =>
  void window.navigator.clipboard.writeText(`${site.url.base}${url}`).then(() => toast.success('Link copied.'));

const SharedAction = ({ post: { url, title } }: { post: Post }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' size='icon'>
        <Share1Icon className='size-4' />
        <span className='sr-only'>Share</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='font-sans'>
      <DropdownMenuItem asChild>
        <button className='w-full cursor-pointer' onClick={() => handleCopyLink(url)}>
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

const ConfigAction = ({ post: { editUrl, sourceUrl } }: { post: Post }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' size='icon'>
        <CodeIcon className='size-4' />
        <span className='sr-only'>Report</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='font-sans'>
      <NavLink href={editUrl as Route} isExternal>
        Edit the page on GitHub
      </NavLink>
      <NavLink href='https://github.com/kkhys/me/issues/new' isExternal>
        Report the content issue
      </NavLink>
      <NavLink href={sourceUrl as Route} isExternal>
        View the source on GitHub
      </NavLink>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const ActionController = ({ post, className }: { post: Post; className?: string }) => (
  <div className={cn('flex justify-end gap-x-1', className)}>
    <ConfigAction post={post} />
    <SharedAction post={post} />
  </div>
);
