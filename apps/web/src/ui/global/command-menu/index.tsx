'use client';

import type { Route } from 'next';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LaptopIcon, MagnifyingGlassIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import {
  Button,
  cn,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@kkhys/ui';

import { searchItems } from '#/config';

export const CommandMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { theme, systemTheme, setTheme } = useTheme();
  const selectedTheme = theme === 'system' ? systemTheme : theme;

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
        className={cn(
          'relative hidden h-8 w-36 items-center justify-start bg-background pr-12 text-xs text-muted-foreground md:inline-flex',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <span className='inline-block font-sans'>Search ...</span>
        <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
          <span>⌘</span>K
        </kbd>
      </Button>
      <Button variant='ghost' size='icon' onClick={() => setOpen(true)} className='md:hidden'>
        <MagnifyingGlassIcon className='size-4' />
        <span className='sr-only'>Search</span>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/noto-emoji/${item.emoji}.svg?theme=${selectedTheme === 'dark' ? 'dark' : 'light'}`}
                    alt={item.emoji}
                    className='mr-3 size-4'
                  />
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
