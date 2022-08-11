import { Link } from 'gatsby';
import React from 'react';
import { IconCaret } from '^/elements';

export const CategoryPagination = () => (
  <nav className='flex items-center justify-between border-t border-gray-200 px-4 sm:px-0'>
    <div className='-mt-px flex w-0 flex-1'>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        <IconCaret direction='right' aria-hidden='true' />
        Previous
      </Link>
    </div>
    <div className='hidden md:-mt-px md:flex'>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        1
      </Link>
      {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600'
        aria-current='page'
      >
        2
      </Link>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        3
      </Link>
      <span className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500'>
        ...
      </span>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        8
      </Link>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        9
      </Link>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        10
      </Link>
    </div>
    <div className='-mt-px flex w-0 flex-1 justify-end'>
      <Link
        to='/#'
        className='inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
      >
        Next
        <IconCaret direction='left' aria-hidden='true' />
      </Link>
    </div>
  </nav>
);
