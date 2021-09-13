import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TablePaginationProps, PaginationData } from 'Interfaces/Common';
import { RootState } from 'typesafe-actions';

type PaginationSelector = (state: RootState) => PaginationData;

interface UsePaginationParams {
  paginationSelector: PaginationSelector;
  itemsLimit?: number;
  initialPage?: number;
}

export default ({
  paginationSelector,
  itemsLimit = 10,
  initialPage = 0,
}: UsePaginationParams) => {
  const [pageNumber, setPageNumber] = useState(initialPage);
  const paginationData = useSelector(paginationSelector);
  const paginationProps: TablePaginationProps = {
    ...paginationData,
    itemsLimit,
    pageNumber,
  };

  return [paginationProps, setPageNumber] as const;
};
