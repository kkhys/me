'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeftIcon } from '#/ui';

export const BrowserBackButton = () => {
  const router = useRouter();

  return (
    <button
      type='button'
      onClick={() => router.back()}
      aria-label='ブログ一覧に戻る'
      className='group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-gray-800/5 ring-1 ring-gray-900/5 transition dark:border dark:border-gray-700/50 dark:bg-gray-800 dark:ring-0 dark:ring-white/10 dark:hover:border-gray-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0'
    >
      <ArrowLeftIcon className='h-4 w-4 stroke-gray-500 transition group-hover:stroke-gray-700 dark:stroke-gray-500 dark:group-hover:stroke-gray-400' />
    </button>
  );
};
