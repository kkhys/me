'use client';

import type { Route } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResetIcon } from '@radix-ui/react-icons';

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kkhys/ui';

import { AppContext } from '#/providers';

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
            className='fixed top-0 hidden -translate-x-[160px] translate-y-[120px] xl:flex'
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
