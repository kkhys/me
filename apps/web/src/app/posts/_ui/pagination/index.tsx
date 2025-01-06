import {
  type ButtonProps,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as _Pagination,
  buttonVariants,
  cn,
} from "@kkhys/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type PaginationLinkProps = {
  isActive?: boolean;
  isDisabled?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  if (isDisabled) {
    return (
      <span
        className={cn(
          buttonVariants({
            variant: "ghost",
            size,
          }),
          "pointer-events-none text-muted-foreground cursor-pointer select-none font-sans",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        isDisabled && "pointer-events-none text-muted-foreground",
        isActive && "pointer-events-none",
        "cursor-pointer select-none font-sans",
        className,
      )}
      {...props}
    />
  );
};

const PaginationPrevious = ({
  isDisabled,
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <>
    <PaginationLink
      aria-label="Go to previous page"
      size="icon"
      isDisabled={isDisabled}
      className={cn("hidden sm:inline-flex", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
    </PaginationLink>
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      isDisabled={isDisabled}
      className={cn("inline-flex sm:hidden gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </PaginationLink>
  </>
);

const PaginationNext = ({
  isDisabled,
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <>
    <PaginationLink
      aria-label="Go to next page"
      size="icon"
      isDisabled={isDisabled}
      className={cn("hidden sm:inline-flex", className)}
      {...props}
    >
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      isDisabled={isDisabled}
      className={cn("inline-flex sm:hidden gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  </>
);

// Example:
// Current page: ① → Output: 1 2 ... 10
// Current page: ② → Output: 1 2 3 ... 10
// Current page: ③ → Output: 1 2 3 4 ... 10
// Current page: ④ → Output: 1 ... 3 4 5 ... 10
// Current page: ⑤ → Output: 1 ... 4 5 6 ... 10
// Current page: ⑥ → Output: 1 ... 5 6 7 ... 10
// Current page: ⑦ → Output: 1 ... 6 7 8 ... 10
// Current page: ⑧ → Output: 1 ... 7 8 9 10
// Current page: ⑨ → Output: 1 ... 7 8 9 10
// Current page: ⑩ → Output: 1 ... 7 8 9 10
const generateVisiblePages = ({
  totalPages,
  currentPage,
}: Record<"totalPages" | "currentPage", number>) => {
  const pages: (number | "...")[] = [];
  const delta = 1;
  const leftEdge = 1;
  const rightEdge = totalPages;

  pages.push(leftEdge);

  if (currentPage > delta + 2) {
    pages.push("...");
  }

  for (
    let i = Math.max(currentPage - delta, leftEdge + 1);
    i <= Math.min(currentPage + delta, rightEdge - 1);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < rightEdge - (delta + 1)) {
    pages.push("...");
  }

  if (totalPages > leftEdge) {
    pages.push(rightEdge);
  }

  return pages;
};

export const Pagination = ({
  totalPages,
  currentPage,
  path,
  className,
}: {
  totalPages: number;
  currentPage: number;
  path: string;
  className?: string;
}) => {
  const visiblePages = generateVisiblePages({ totalPages, currentPage });

  return (
    <_Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${path}/${currentPage - 1}` as Route}
            isDisabled={currentPage === 1}
          />
        </PaginationItem>
        {visiblePages.map((page, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <PaginationItem key={i} className="hidden sm:block">
            {typeof page === "string" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`${path}/${page}` as Route}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`${path}/${currentPage + 1}` as Route}
            isDisabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </_Pagination>
  );
};
