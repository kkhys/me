import { Listbox } from '@headlessui/react';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import {
  DarkIcon,
  IconProps,
  LightIcon,
  SystemIcon,
} from '@/components/elements';

type ThemeSelectorProps = {
  className?: string;
};

type Themes = {
  name: 'Light' | 'Dark' | 'System';
  value: 'light' | 'dark' | 'system';
  icon: FC<IconProps>;
};

const themes = [
  { name: 'Light', value: 'light', icon: LightIcon },
  { name: 'Dark', value: 'dark', icon: DarkIcon },
  { name: 'System', value: 'system', icon: SystemIcon },
];

export const ThemeSelector: FC<ThemeSelectorProps> = ({ className }) => {
  const [selectedTheme, setSelectedTheme] = useState<Themes>();

  useEffect(() => {
    if (selectedTheme) {
      document.documentElement.setAttribute('data-theme', selectedTheme.value);
    } else {
      setSelectedTheme(
        themes.find(
          (theme) =>
            theme.value === document.documentElement.getAttribute('data-theme'),
        ) as Themes,
      );
    }
  }, [selectedTheme]);

  return (
    <Listbox
      as='div'
      value={selectedTheme}
      onChange={setSelectedTheme}
      className={className}
    >
      <Listbox.Label className='sr-only'>Theme</Listbox.Label>
      <Listbox.Button
        className='shadow-black/5 ring-black/5 dark:ring-white/5 flex h-6 w-6 items-center justify-center rounded-lg shadow-md ring-1 dark:bg-primary/10 dark:ring-inset'
        aria-label={selectedTheme?.name}
      >
        <LightIcon className='hidden h-4 w-4 fill-sky-400 [[data-theme=light]_&]:block' />
        <DarkIcon className='hidden h-4 w-4 fill-sky-400 [[data-theme=dark]_&]:block' />
        <LightIcon className='hidden h-4 w-4 fill-slate-400 [:not(.dark)[data-theme=system]_&]:block' />
        <DarkIcon className='hidden h-4 w-4 fill-slate-400 [.dark[data-theme=system]_&]:block' />
      </Listbox.Button>
      <Listbox.Options className='shadow-black/5 ring-black/5 dark:ring-white/5 absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md ring-1 dark:bg-primary/5'>
        {themes.map((theme) => (
          <Listbox.Option
            key={theme.value}
            value={theme}
            className={({ active, selected }) =>
              clsx(
                'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                {
                  'text-sky-500': selected,
                  'text-slate-900 dark:text-white': active && !selected,
                  'text-slate-700 dark:text-slate-400': !active && !selected,
                  'bg-slate-100 dark:bg-slate-900/40': active,
                },
              )
            }
          >
            {({ selected }) => (
              <>
                <div className='dark:ring-white/5 rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset'>
                  <theme.icon
                    className={clsx(
                      'h-4 w-4',
                      selected
                        ? 'fill-sky-400 dark:fill-sky-400'
                        : 'fill-slate-400',
                    )}
                  />
                </div>
                <div className='ml-3'>{theme.name}</div>
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
