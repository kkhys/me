import * as React from 'react';

import {
  Pagination as _Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@kkhys/ui';

export const Pagination = ({
  className,
  next,
  prev,
  jump,
  currentPage,
  maxPage,
}: {
  className?: string;
  next: () => void;
  prev: () => void;
  jump: (page: number) => void;
  currentPage: number;
  maxPage: number;
}) => {
  const pages = [...Array(maxPage).keys()].map((i) => i + 1);

  const hasLeftEllipsis = currentPage > 3;
  const hasRightEllipsis = currentPage < maxPage - 2;

  const leftEdgePage = 1;
  const rightEdgePage = maxPage;
  let visiblePages: (number | '...')[];

  if (hasLeftEllipsis && hasRightEllipsis) {
    visiblePages = [
      leftEdgePage,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      rightEdgePage,
    ];
  } else if (hasLeftEllipsis && !hasRightEllipsis) {
    visiblePages = [leftEdgePage, '...', ...pages.slice(-3)];
  } else if (!hasLeftEllipsis && hasRightEllipsis) {
    visiblePages = [...pages.slice(0, 3), '...', rightEdgePage];
  } else {
    visiblePages = pages;
  }

  return (
    <_Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={prev} isDisabled={currentPage === 1} />
        </PaginationItem>
        {visiblePages.map((page, i) => (
          <PaginationItem key={i} className='hidden sm:block'>
            {typeof page === 'string' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => jump(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={next} isDisabled={currentPage === maxPage} />
        </PaginationItem>
      </PaginationContent>
    </_Pagination>
  );
};

export * from './use-pagination';
