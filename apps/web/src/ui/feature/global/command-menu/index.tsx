'use client';

import * as React from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { searchItems } from '#/config';
import { cn } from '#/lib/shadcn-ui/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/ui/data-entry';
import { Button } from '#/ui/general';

export const CommandMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant='outline'
        className={cn('bg-background text-muted-foreground relative pr-12 text-xs', className)}
        onClick={() => setOpen(true)}
      >
        <span className='inline-block font-sans'>Search ...</span>
        <kbd className='bg-muted pointer-events-none absolute right-[0.3rem] top-[0.3rem] flex h-6 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100'>
          <span>⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchItems.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.href as Route))}
                >
                  <div className='mr-3 flex size-4 items-center justify-center'>
                    <span className='font-emoji text-xs'>{item.emoji}</span>
                  </div>
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Theme' className='font-sans'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <div className='mr-3 flex size-4 items-center justify-center'>
                <SunIcon className='size-3' />
              </div>
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <div className='mr-3 flex size-4 items-center justify-center'>
                <MoonIcon className='size-3' />
              </div>
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <div className='mr-3 flex size-4 items-center justify-center'>
                <LaptopIcon className='size-3' />
              </div>
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
