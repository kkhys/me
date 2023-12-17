'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ResetIcon } from '@radix-ui/react-icons';

import { AppContext } from '#/providers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { Button } from '#/ui/general';

export const BackButton = () => {
  const router = useRouter();
  const { previousPathname } = React.useContext(AppContext);

  if (!previousPathname) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.back()}
            aria-label='Go back to previous page'
            className='lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-8 xl:mt-0'
          >
            <ResetIcon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go back to previous page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
