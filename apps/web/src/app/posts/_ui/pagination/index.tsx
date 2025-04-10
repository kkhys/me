import { type ButtonProps, buttonVariants } from "@kkhys/ui/button";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as _Pagination,
} from "@kkhys/ui/pagination";
import { cn } from "@kkhys/ui/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      isActive && "pointer-events-none",
      "cursor-pointer select-none font-sans",
      className,
    )}
    {...props}
  />
);

const DisabledPaginationLink = ({
  navigation,
  className,
  ...props
}: { navigation: "previous" | "next" } & React.ComponentProps<"span">) => {
  const renderPaginationLink = (
    size: "icon" | "default",
    extraClassName: string,
  ) => (
    <span
      aria-disabled={true}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size,
        }),
        extraClassName,
        "pointer-events-none text-muted-foreground cursor-pointer select-none font-sans",
      )}
      {...props}
    >
      {navigation === "previous" ? (
        <ChevronLeftIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
      {size === "default" &&
        (navigation === "previous" ? <span>Previous</span> : <span>Next</span>)}
    </span>
  );

  return (
    <>
      {renderPaginationLink("icon", "hidden sm:inline-flex")}
      {renderPaginationLink("default", "inline-flex sm:hidden gap-1 pl-2.5")}
    </>
  );
};

const PaginationPrevious = ({
  className,
  isDisabled,
  ...props
}: { isDisabled: boolean } & React.ComponentProps<typeof PaginationLink>) => {
  if (isDisabled) {
    return <DisabledPaginationLink navigation="previous" />;
  }

  const renderPaginationLink = (
    size: "icon" | "default",
    extraClassName: string,
  ) => (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      className={cn(extraClassName, className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      {size === "default" && <span>Previous</span>}
    </PaginationLink>
  );

  return (
    <>
      {renderPaginationLink("icon", "hidden sm:inline-flex")}
      {renderPaginationLink("default", "inline-flex sm:hidden gap-1 pl-2.5")}
    </>
  );
};

const PaginationNext = ({
  isDisabled,
  className,
  ...props
}: { isDisabled: boolean } & React.ComponentProps<typeof PaginationLink>) => {
  if (isDisabled) {
    return <DisabledPaginationLink navigation="next" />;
  }

  return (
    <>
      <PaginationLink
        aria-label="Go to next page"
        size="icon"
        className={cn("hidden sm:inline-flex", className)}
        {...props}
      >
        <ChevronRightIcon className="size-4" />
      </PaginationLink>
      <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("inline-flex sm:hidden gap-1 pr-2.5", className)}
        {...props}
      >
        <span>Next</span>
        <ChevronRightIcon className="size-4" />
      </PaginationLink>
    </>
  );
};

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
        {visiblePages.map((page) => (
          <PaginationItem
            key={`page-${crypto.randomUUID()}`}
            className="hidden sm:block"
          >
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
