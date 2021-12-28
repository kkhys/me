import * as React from "react";
import { Link } from "gatsby";

const Pagination = ({
  numPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
  pagePath,
  className,
}) => {
  if (!hasNextPage && !hasPrevPage) {
    return null;
  }

  let pageNumbers = [];

  if (numPages <= 7) {
    for (let i = 1; i <= numPages; i++) {
      pageNumbers.push(i);
    }
  } else if (currentPage <= 4) {
    pageNumbers = [1, 2, 3, 4, 5, "…", numPages];
  } else if (currentPage < numPages - 3) {
    pageNumbers = [
      1,
      "…",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "…",
      numPages,
    ];
  } else {
    pageNumbers = [
      1,
      "…",
      numPages - 4,
      numPages - 3,
      numPages - 2,
      numPages - 1,
      numPages,
    ];
  }

  return (
    <div className={className}>
      <div className="pagination__prev">
        <Link
          rel="prev"
          to={hasPrevPage ? pagePath(currentPage - 1) : "/#"}
          className={`pagination__prev-link ${!hasPrevPage && "-disable"}`}
        >
          &lt; Prev
        </Link>
      </div>
      <ul className="pagination__list-container">
        {pageNumbers.map((pn, i) => (
          <li key={`pageNum-${i}`}>
            {pn === "…" ? (
              <span>…</span>
            ) : (
              <Link
                to={pagePath(pn)}
                className={pn === currentPage ? "selected" : ""}
              >
                {pn}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className="pagination__next">
        <Link
          rel="next"
          to={hasNextPage ? pagePath(currentPage + 1) : "/#"}
          className={`pagination__next-link ${!hasNextPage && "-disable"}`}
        >
          Next &gt;
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
