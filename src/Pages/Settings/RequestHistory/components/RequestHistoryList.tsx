import React from 'react';
import { ReactSVG } from 'react-svg';
import { TablePaginationProps } from 'Interfaces/Common';
import EmptyTable from 'Components/EmptyTable';
import IconSort from 'Assets/images/icons/sort.svg';
import RequestHistoryTableItem from './RequestHistoryTableItem';
import UISpinner from 'Components/UIComponents/UISpinner';
import { RequestHistoryItem } from 'Interfaces/RequestsHistory';
import History from 'Services/History';

interface RequestHistoryProps {
  requestHistory: RequestHistoryItem[];
  paginationProps?: TablePaginationProps;
  requestOrdering: (key: string) => void;
  isLoading: boolean;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function RequestHistoryList({
  requestHistory,
  paginationProps = defaultPaginationProps,
  isLoading,
  requestOrdering,
}: RequestHistoryProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;

  if (requestHistory.length === 0 && !isLoading)
    return (
      <div className="documents__empty-table">
        <EmptyTable
          onClick={() => History.push('/settings/api')}
          iconClassName="empty-table__icon--document"
          buttonText="Back to api settings"
          headerText="There is no request history"
        />
      </div>
    );

  return (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <p className="tableControls__pagingCounter">
          {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit +
            (itemsCount || itemsLimit)}`}
          &nbsp;of&nbsp;
          <span>{totalItems}</span>
          &nbsp;results
        </p>
      </div>
      <div className="table__container">
        <div className="table__innerContainer">
          <div className="table__row table__header">
            <div className="table__column table__column--text apiKeys__column--large">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('type')}
              >
                <span>TYPE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--date apiKeys__column--medium">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('createdAt')}
              >
                <span>DATE</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--date apiKeys__column--medium">
              HOUR
            </div>
            <div className="table__column table__column--text apiKeys__column--small">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('origin')}
              >
                <span>ORIGIN</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
          </div>
          {isLoading ? (
            <UISpinner
              width={50}
              height={50}
              wrapperClassName="documents__spinner spinner--main__wrapper"
            />
          ) : (
            requestHistory.map(requestHistoryItem => {
              return (
                <RequestHistoryTableItem
                  key={requestHistoryItem.id}
                  requestHistoryItem={requestHistoryItem}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestHistoryList;
