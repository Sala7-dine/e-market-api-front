// eslint-disable-next-line no-unused-vars
import React, { memo, useCallback, useMemo } from "react";
import "../assets/styles/admin/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }) => {
  const current = Number(currentPage);
  const total = Number(totalPages);

  const handlePageClick = useCallback(
    (page) => {
      if (page !== current && page >= 1 && page <= total) {
        onPageChange(page);
      }
    },
    [current, total, onPageChange]
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`pagination-btn ${i === current ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    return pages;
  }, [current, total, handlePageClick]);

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageClick(current - 1)}
        disabled={!hasPrev}
        className="pagination-btn"
      >
        Précédent
      </button>

      {pageNumbers}

      <button
        onClick={() => handlePageClick(current + 1)}
        disabled={!hasNext}
        className="pagination-btn"
      >
        Suivant
      </button>
    </div>
  );
};

export default memo(Pagination);
