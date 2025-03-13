import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {

 const renderPageNumbers = () => {
         const pageNumbers = [];
         for (let i = 1; i <= totalPages; i++) {
             pageNumbers.push(
                 <button
                   key={i}
                     onClick={() => handlePageChange(i)}
                   className={`mx-1 px-3 py-1 rounded-md transition duration-300
                       ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                   >
                     {i}
                   </button>
             );
         }
         return pageNumbers;
      };
    return (
    <div className="flex justify-center mt-6">
            {renderPageNumbers()}
        </div>

    );
};
export default Pagination;