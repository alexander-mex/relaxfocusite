import React from 'react';

const Pagination = ({ currentPage, pageTokens, handlePageChange }) => {
  const renderPagination = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="pagination-arrow">←</button>
      );
    }

    for (let i = 1; i <= 2; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    if (currentPage < 2 && pageTokens[2]) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="pagination-arrow">→</button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      {renderPagination()}
    </div>
  );
};

export default Pagination;