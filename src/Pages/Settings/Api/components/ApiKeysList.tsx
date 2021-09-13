import React from 'react';
import { ReactSVG } from 'react-svg';
import { TablePaginationProps } from 'Interfaces/Common';
import EmptyTable from 'Components/EmptyTable/EmptyTable';
import IconSort from 'Assets/images/icons/sort.svg';
import ApiIcon from 'Assets/images/icons/api-icon.svg';
import ApiKeyItem from './ApiKeyItem/ApiKeyItem';
import { ApiKey } from 'Interfaces/ApiKey';
import UISpinner from 'Components/UIComponents/UISpinner';

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  paginationProps?: TablePaginationProps;
  requestOrdering: (key: string) => void;
  isLoading: boolean;
  createApiKey: () => void;
  onApiKeyDelete: (id: ApiKey['id']) => void;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function ApiKeysList({
  apiKeys,
  paginationProps = defaultPaginationProps,
  isLoading,
  requestOrdering,
  onApiKeyDelete,
  createApiKey,
}: ApiKeysListProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;
  if (apiKeys.length === 0 && !isLoading)
    return (
      <div className="documents__empty-table">
        <EmptyTable
          onClick={createApiKey}
          icon={ApiIcon}
          iconClassName="empty-table__icon--team"
          buttonText="Create API Key"
          headerText="You don't have any API keys yet."
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
            <div className="table__column table__column--text apiKeys__column--medium">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('name')}
              >
                <span>NAME</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--prefix apiKeys__column--small">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('prefix')}
              >
                <span>PREFIX</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column--date apiKeys__column--medium">
              <button
                className="tableControls__headerControl"
                onClick={() => requestOrdering('createdAt')}
              >
                <span>DATE CREATED</span>
                <ReactSVG src={IconSort} />
              </button>
            </div>
            <div className="table__column table__column__text apiKeys__column--small">
              REQUESTS
            </div>
            <div className="table__column table__column--action">ACTION</div>
          </div>
          {isLoading ? (
            <UISpinner
              width={50}
              height={50}
              wrapperClassName="documents__spinner spinner--main__wrapper"
            />
          ) : (
            apiKeys.map(apiKey => {
              return (
                <ApiKeyItem
                  onDeleteSuccess={onApiKeyDelete}
                  key={apiKey.id}
                  apiKey={apiKey}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiKeysList;
