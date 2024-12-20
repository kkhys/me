'use client';

import type { Route } from 'next';
import type { LinkProps } from 'next/link';
import * as React from 'react';
import Link from 'next/link';
import {
  ArrowTopRightIcon,
  DotsHorizontalIcon,
  HomeIcon,
} from '@radix-ui/react-icons';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kkhys/ui';

import { site, storybook } from '#/config';

const NavLink = ({
  href,
  children,
  isExternal = false,
  ...props
}: {
  isExternal?: boolean;
} & LinkProps<string>) => (
  <DropdownMenuItem asChild>
    <Link
      href={href}
      className='cursor-pointer'
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {isExternal && <ArrowTopRightIcon className='ml-1 size-3' />}
    </Link>
  </DropdownMenuItem>
);

const NavLinkWithTooltip = <T extends string>({
  href,
  tooltipContent,
  children,
  isExternal = false,
}: {
  href: Route<T>;
  tooltipContent: string;
  children: React.ReactNode;
  isExternal?: boolean;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant='ghost' size='icon'>
          <Link
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {children}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className='flex items-center'>
          <p className='font-sans'>{tooltipContent}</p>
          {isExternal && <ArrowTopRightIcon className='ml-1 size-3' />}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const NavLinks = () => (
  <>
    <NavLinkWithTooltip href='/' tooltipContent='Home'>
      <HomeIcon className='size-4' />
      <span className='sr-only'>Link to home</span>
    </NavLinkWithTooltip>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <DotsHorizontalIcon className='size-4' />
          <span className='sr-only'>Links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='font-sans'>
        <NavLink href={site.url.roadmap} isExternal>
          Roadmap
        </NavLink>
        <NavLink href={storybook.url.base} isExternal>
          Storybook
        </NavLink>
        <NavLink href={site.url.repository} isExternal>
          Source
        </NavLink>
        <DropdownMenuSeparator />
        <NavLink href='/legal/privacy-policy'>Privacy Policy</NavLink>
        <NavLink href='/legal/terms'>Terms of Service</NavLink>
      </DropdownMenuContent>
    </DropdownMenu>
    <a className='hidden' rel='me' href='https://mastodon.kkhys.me/@kkhys'>
      Mastodon
    </a>
    <a className='hidden' rel='me' href='https://misskey.io/@kkhys'>
      Misskey.io
    </a>
  </>
);
