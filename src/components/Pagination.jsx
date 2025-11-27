import "../assets/styles/admin/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }) => {
  const current = Number(currentPage);
  const total = Number(totalPages);

  const handlePageClick = (page) => {
    if (page !== current && page >= 1 && page <= total) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
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
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageClick(current - 1)}
        disabled={!hasPrev}
        className="pagination-btn"
      >
        Précédent
      </button>

      {renderPageNumbers()}

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

export default Pagination;
