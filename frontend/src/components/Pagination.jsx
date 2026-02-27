import React from "react";

const Pagination = ({ pageData, setPageData }) => {
  if (!pageData) return null;

  const { currentPage, totalPages } = pageData;

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() =>
          setPageData((prev) => ({
            ...prev,
            currentPage: prev.currentPage - 1,
          }))
        }
      >
        Previous
      </button>

      <button className="page-btn active">
        {currentPage}
      </button>

      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() =>
          setPageData((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }))
        }
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;