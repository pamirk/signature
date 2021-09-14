import UIButton from 'Components/UIComponents/UIButton';
import { useApiKeysGet } from 'Hooks/ApiKeys';
import { useDataOrdering, useModal, usePagination } from 'Hooks/Common';
import { OrderingDirection } from 'Interfaces/Common';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import {
  selectApiKeys,
  selectApiKeysPaginationData,
  selectApiSubscriptionInfo,
} from 'Utils/selectors';
import ApiKeyModal from './components/ApiKeyModal/ApiKeyModal';
import ApiKeysList from './components/ApiKeysList';
import UIPaginator from 'Components/UIComponents/UIPaginator';
import ApiPlansSection from 'Components/ApiPlansSection';
import { useApiSubscriptionGet } from 'Hooks/Billing';
import UISpinner from 'Components/UIComponents/UISpinner';

type selectedPage = { selected: number };

const Api = () => {
  const [getApiKeys, isApiKeysLoading] = useApiKeysGet();
  const [getApiSubscription, isGettingApiDataLoading] = useApiSubscriptionGet();
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectApiKeysPaginationData,
  });

  const subscriptionData = useSelector(selectApiSubscriptionInfo);
  const apiKeys = useSelector(selectApiKeys);
  const { requestOrdering, orderingConfig } = useDataOrdering(apiKeys, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });

  const handleChangePage = (page: selectedPage) => {
    setPageNumber(page.selected);
  };

  const handleGetApiKeys = useCallback(async () => {
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();
    try {
      getApiKeys({
        limit: paginationProps.itemsLimit,
        page: paginationProps.pageNumber + 1,
        orderingKey: key,
        orderingDirection,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationProps.itemsLimit, paginationProps.pageNumber, orderingConfig]);

  const handleGetApiKeysFromFirstPage = useCallback(async () => {
    const { key, direction } = orderingConfig;
    const orderingDirection = direction.toString().toUpperCase();
    try {
      getApiKeys({
        limit: paginationProps.itemsLimit,
        page: 1,
        orderingKey: key,
        orderingDirection,
      });

      if (paginationProps.pageNumber !== 0) setPageNumber(0);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    getApiKeys,
    orderingConfig,
    paginationProps.itemsLimit,
    paginationProps.pageNumber,
    setPageNumber,
  ]);

  const handleApiSubscriptionGet = useCallback(async () => {
    try {
      await getApiSubscription(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [openGenerateApiKeyModal, closeGenerateApiKeyModal] = useModal(
    () => (
        //@ts-ignore
      <ApiKeyModal onSuccessGenerate={handleGetApiKeysFromFirstPage} onClose={closeGenerateApiKeyModal}/>
    ),
    [],
  );

  useEffect(() => {
    return () => setPageNumber(0);
  }, [setPageNumber]);

  useEffect(() => {
    handleGetApiKeys();
    handleApiSubscriptionGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetApiKeys]);

  return (
    <div className="documents__wrapper">
      {isGettingApiDataLoading ? (
        <div className="documents__spinner">
          <UISpinner width={50} height={50} className="spinner--main__wrapper" />
        </div>
      ) : (
        <>
          {subscriptionData && (
            <div className="apiKeys__table">
              <div className="team__header-container">
                <div className="company__billet-container">
                  <p className="team__header-title">Api Keys</p>
                </div>
                <div className="team__button">
                  <UIButton
                    priority="primary"
                    handleClick={openGenerateApiKeyModal}
                    title="Create API key"
                  />
                </div>
              </div>
              <ApiKeysList
                apiKeys={apiKeys}
                onApiKeyDelete={handleGetApiKeysFromFirstPage}
                createApiKey={openGenerateApiKeyModal}
                requestOrdering={requestOrdering}
                isLoading={isApiKeysLoading}
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
          )}
          <ApiPlansSection />
        </>
      )}
    </div>
  );
};

export default Api;
