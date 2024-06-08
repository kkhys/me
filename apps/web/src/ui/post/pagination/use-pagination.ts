'use client';

import type { Post } from 'contentlayer/generated';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const usePagination = (data: Post[], itemsPerPage = 10) => {
  const _searchParams = useSearchParams();
  const searchParams = React.useMemo(() => new URLSearchParams(_searchParams), [_searchParams]);

  const router = useRouter();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentCategory, setCurrentCategory] = React.useState('all');

  const maxPage = React.useMemo(() => Math.ceil(data.length / itemsPerPage), [data, itemsPerPage]);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const changePage = (newPage: number) => {
    const pageNumber = Math.max(1, newPage);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
    searchParams.set('page', String(pageNumber));
    router.replace(`/posts?${searchParams.toString()}`);
  };

  const next = () => changePage(currentPage + 1);

  const prev = () => changePage(currentPage - 1);

  const jump = (page: number) => changePage(page);

  React.useEffect(() => {
    const category = searchParams.get('category') ?? 'all';

    if (currentCategory !== category) {
      setCurrentCategory(category ?? 'all');
      setCurrentPage(1);
      return;
    }

    const page = Number(searchParams.get('page'));

    if (page && page > 0 && page <= maxPage) {
      setCurrentPage(page);
    }
  }, [currentCategory, maxPage, searchParams]);

  return { next, prev, jump, currentData, currentPage, maxPage };
};
