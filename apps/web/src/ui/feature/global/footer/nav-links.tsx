'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon, DotsHorizontalIcon, HomeIcon } from '@radix-ui/react-icons';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { Button } from '#/ui/general';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/ui/navigation';

const NavLink = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
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
      {isExternal && <ArrowTopRightIcon className='ml-1 h-3 w-3' />}
    </Link>
  </DropdownMenuItem>
);

const NavLinkWithTooltip = ({
  href,
  tooltipContent,
  children,
  isExternal = false,
}: {
  href: string;
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
          <p className='font-serif'>{tooltipContent}</p>
          {isExternal && <ArrowTopRightIcon className='ml-1 h-3 w-3' />}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const NavLinks = () => (
  <>
    <NavLinkWithTooltip href='/' tooltipContent='Home'>
      <HomeIcon className='h-4 w-4' />
      <span className='sr-only'>Link to home</span>
    </NavLinkWithTooltip>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='font-serif'>
        <DropdownMenuLabel>Dev</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavLink href='https://github.com/users/kkhys/projects/3' isExternal>
          Roadmap
        </NavLink>
        {/* TODO: change href */}
        <NavLink href='/' isExternal>
          Storybook
        </NavLink>
        <NavLink href='https://github.com/kkhys/me' isExternal>
          Source
        </NavLink>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
);
