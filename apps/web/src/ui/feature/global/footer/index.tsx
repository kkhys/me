import * as React from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { Book, FolderKanban } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { ContainerInner, ContainerOuter } from '#/ui/feature/global';
import { Button } from '#/ui/general';

const NavLink = ({
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
          <p>{tooltipContent}</p>
          {isExternal && <ArrowTopRightIcon className='ml-1 h-3 w-3' />}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const Footer = () => (
  <footer className='mt-32 flex-none'>
    <ContainerOuter>
      <div className='border-t border-zinc-100 pb-6 pt-6 dark:border-zinc-700/40'>
        <ContainerInner>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='flex flex-wrap justify-center gap-x-1 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200'>
              <NavLink href='https://github.com/users/kkhys/projects/3' tooltipContent='Roadmap' isExternal>
                <FolderKanban className='h-4 w-4' />
              </NavLink>
              {/* TODO: add storybook link */}
              <NavLink href='/' tooltipContent='Storybook' isExternal>
                <Book className='h-4 w-4' />
              </NavLink>
              <NavLink href='https://github.com/kkhys/me' tooltipContent='Source' isExternal>
                <GitHubLogoIcon className='h-4 w-4' />
              </NavLink>
            </div>
            <p className='text-xs text-zinc-400 dark:text-zinc-500'>
              CC BY-NC-SA 4.0 2023-PRESENT &copy; Keisuke Hayashi
            </p>
          </div>
        </ContainerInner>
      </div>
    </ContainerOuter>
  </footer>
);
