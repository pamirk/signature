import { useDataOrdering, usePagination } from 'Hooks/Common';
import { OrderingDirection } from 'Interfaces/Common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router';
import Toast from 'Services/Toast';
import {
  selectRequestHistory,
  selectRequestHistoryPaginationData,
} from 'Utils/selectors';
import RequestHistoryList from './components/RequestHistoryList';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import { ApiKey } from 'Interfaces/ApiKey';
import History from 'Services/History';
import { useRequestHistoryGet } from 'Hooks/RequestHistory';
import UIButton from 'Components/UIComponents/UIButton';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

type selectedPage = { selected: number };

interface ApiKeyParams {
  apiKeyId: ApiKey['id'];
}

const RequestHistory = ({ match }: RouteChildrenProps<ApiKeyParams>) => {
  const apiKeyId = useMemo(() => match?.params.apiKeyId, [match]);

  const [getRequestHistory, isRequestHistoryLoading] = useRequestHistoryGet();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectRequestHistoryPaginationData,
  });
  const requestHistory = useSelector(selectRequestHistory);
  const { requestOrdering, orderingConfig } = useDataOrdering(requestHistory, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  const handleGetRequestHistory = useCallback(async () => {
    if (!apiKeyId) {
      History.push(AuthorizedRoutePaths.BASE_PATH);
      return;
    }

    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();
    try {
      getRequestHistory({
        limit: paginationProps.itemsLimit,
        page: paginationProps.pageNumber + 1,
        orderingKey: key,
        orderingDirection,
        apiKeyId,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationProps.itemsLimit, paginationProps.pageNumber, orderingConfig]);

  useEffect(() => {
    return () => setPageNumber(0);
  }, [setPageNumber]);

  useEffect(() => {
    handleGetRequestHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetRequestHistory]);

  return (
    <div className="documents__wrapper">
      <div className="team__header-container">
        <div className="company__billet-container">
          <p className="team__header-title">Request History</p>
        </div>
        <UIButton
          className="apiKeys__back-button"
          priority="secondary"
          handleClick={() => History.push(AuthorizedRoutePaths.SETTINGS_API)}
          title="Back"
        />
      </div>
      <RequestHistoryList
        requestHistory={requestHistory}
        requestOrdering={requestOrdering}
        isLoading={isRequestHistoryLoading}
        paginationProps={paginationProps}
      />
      {paginationProps.pageCount > 1 && (
        <UIPaginator
          initialPage={paginationProps.pageNumber}
          pageCount={paginationProps.pageCount}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
};

export default RequestHistory;
