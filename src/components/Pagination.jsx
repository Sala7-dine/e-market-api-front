import React from 'react';
import '../assets/styles/admin/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={!hasPrev}
        className="pagination-btn"
      >
        Précédent
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={!hasNext}
        className="pagination-btn"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;