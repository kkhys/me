import clsx from 'clsx';
import { Link } from 'gatsby';
import React from 'react';

const tabs = [
  { name: 'New', href: 'new', count: '10', current: true },
  { name: 'Life', href: 'life', count: '52', current: false },
  { name: 'Tech', href: 'tech', count: '6', current: false },
];

export const CategoryTabs = () => (
  <div>
    <div className='sm:hidden'>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor='tabs' className='sr-only'>
        Select a tab
      </label>
      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
      <select
        id='tabs'
        name='tabs'
        className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
        defaultValue={tabs.find((tab) => tab.current)?.name}
      >
        {tabs.map((tab) => (
          <option key={tab.name}>{tab.name}</option>
        ))}
      </select>
    </div>
    <div className='hidden sm:block'>
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={`/${tab.href}`}
              className={clsx(
                tab.current
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
              {tab.count ? (
                <span
                  className={clsx(
                    tab.current
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-900',
                    'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block',
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </div>
);
