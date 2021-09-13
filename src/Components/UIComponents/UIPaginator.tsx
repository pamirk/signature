import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginatorProps {
  onPageChange?: (any:any) => void;
  initialPage?: number;
  pageCount?: number;
}

const Paginator = ({ onPageChange, initialPage, pageCount }: PaginatorProps) => (
  <ReactPaginate
    pageCount={pageCount || 20}
    pageRangeDisplayed={3}
    marginPagesDisplayed={1}
    previousLabel={null}
    nextLabel={null}
    onPageChange={onPageChange}
    forcePage={initialPage}
    containerClassName="paginator__container"
    breakClassName="paginator__break"
    pageClassName="paginator__page"
    activeClassName="paginator__page--active"
  />
);

export default Paginator;
