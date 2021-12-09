import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

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

const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;

  .pagination__prev {
    flex-grow: 1;
    text-align: left;
  }

  .pagination__next {
    flex-grow: 1;
    text-align: right;
  }

  .pagination__prev-link,
  .pagination__next-link {
    color: #539bf5;
    font-size: 1rem;
    vertical-align: middle;
    border: 1px solid transparent;
    padding: 4px 12px;
    border-radius: 6px;
    transition: border-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);

    @media screen and (max-width: 567px) {
      display: none;
    }

    &:hover,
    &:focus {
      border-color: #444c56;
      transition-duration: 0.1s;
      outline: 0;
    }

    &.-disable {
      pointer-events: none;
      color: #545d68;
    }
  }

  .pagination__list-container {
    margin: 0;

    li {
      display: inline-block;
      margin: 5px;

      a,
      span {
        min-width: 32px;
        font-size: 1rem;
        color: #adbac7;
        vertical-align: middle;
        font-weight: normal;
        line-height: 1rem;
        display: inline;
        padding: 4px 10px;
        border: 1px solid transparent;
        border-radius: 6px;
        transition: border-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);

        &:hover,
        &:focus {
          border-color: #444c56;
          transition-duration: 0.1s;
        }
      }

      a.selected {
        color: #cdd9e5;
        background-color: #316dca;
        border-color: transparent;
        pointer-events: none;
      }

      span {
        pointer-events: none;

        &:hover,
        &:focus {
          border-color: transparent;
        }
      }
    }
  }
`;

export default StyledPagination;
