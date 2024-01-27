'use client';

import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResetIcon } from '@radix-ui/react-icons';

import { AppContext } from '#/providers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { Button } from '#/ui/general';

export const BackButton = <T extends string>({
  href,
  tooltipContent,
}: {
  href?: Route<T>;
  tooltipContent?: string;
}) => {
  const router = useRouter();
  const { previousPathname } = React.useContext(AppContext);

  if (!href && !previousPathname) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            aria-label={tooltipContent ?? 'Go back to previous page'}
            className='absolute left-12 top-0 hidden xl:flex'
            onClick={() => !href && router.back()}
            asChild={href ? true : undefined}
          >
            {href ? (
              <Link href={href}>
                <ResetIcon className='size-4' />
              </Link>
            ) : (
              <ResetIcon className='size-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-sans'>{tooltipContent ?? 'Go back to previous page'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
