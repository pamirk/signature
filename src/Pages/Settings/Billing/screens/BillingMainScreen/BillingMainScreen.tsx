import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  AppSumoBillingTable,
  BillingDetails,
  InvoiceTable,
  LifeTimeDealInfoBlock,
} from '../../components';
import UIButton from 'Components/UIComponents/UIButton';
import {
  useSubscriptionDataGet,
  usePlansGet,
  useInvoicesGet,
  useBillingPortalCreate,
  useLatestInvoiceGet,
  usePlanChange,
} from 'Hooks/Billing';
import Toast from 'Services/Toast';
import {
  selectInvoices,
  selectInvoicesPaginationData,
  selectSubscriptionInfo,
  selectUser,
  selectUserPlan,
} from 'Utils/selectors';
import {
  PlanTypes,
  PlanDurations,
  InvoiceTypes,
  PlanChangePayload,
  SpecialOfferKinds,
} from 'Interfaces/Billing';
import {
  useDataOrdering,
  useModal,
  useNewTabOpen,
  usePagination,
  useUrlParamsGet,
} from 'Hooks/Common';
import { User, UserStatuses } from 'Interfaces/User';
import CardForm from 'Components/CardForm';
import SubscriptionInfoBlockMobile from '../../components/SubscriptionInfoBlockMobile';
import { CancelPlanModal } from '../../components/modals/CancelPlanModal';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { PastDueForm } from 'Components/PastDueForm';
import { isNotEmpty } from 'Utils/functions';
import History from 'Services/History';
import { DataLayerAnalytics, FacebookPixel } from 'Services/Integrations';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { OrderingDirection } from 'Interfaces/Common';

const BillingMainScreen = () => {
  const [getInvoices, isInvoicesLoading] = useInvoicesGet();
  const userPlan = useSelector(selectUserPlan);
  const { appSumoStatus, status, ltdTierId }: User = useSelector(selectUser);
  const [getPlans] = usePlansGet();
  const [getSubscriptionData] = useSubscriptionDataGet();
  const [createBillingPortal, isCreatingBillingPortal] = useBillingPortalCreate();
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const invoices = useSelector(selectInvoices);
  const isMobile = useIsMobile();
  const [openNewTab] = useNewTabOpen();
  const urlParams = useUrlParamsGet();
  const { requestOrdering, orderingConfig } = useDataOrdering(invoices, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectInvoicesPaginationData,
    itemsLimit: 5,
  });

  useEffect(() => {
    if (urlParams.success_payment) {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING);
      Toast.success('Payment was successful');
    }
  }, [urlParams]);

  const handleSubscriptionDataGet = useCallback(async () => {
    try {
      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlansGet = useCallback(async () => {
    try {
      await getPlans(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInvoicesGet = useCallback(async () => {
    try {
      await getInvoices({
        types: ltdTierId
          ? [InvoiceTypes.DEFAULT, InvoiceTypes.LTD]
          : [InvoiceTypes.DEFAULT],
        page: paginationProps.pageNumber + 1,
        limit: paginationProps.itemsLimit,
        orderingKey: orderingConfig.key,
        orderingDirection: orderingConfig.direction.toUpperCase(),
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationProps.itemsLimit, paginationProps.pageNumber, orderingConfig]);

  const [changePlan, isChangePlanLoading] = usePlanChange();
  const [getLatestInvoice] = useLatestInvoiceGet();

  const handleChangePlan = useCallback(async () => {
    try {
      const payload: Readonly<PlanChangePayload> = {
        type: userPlan.type,
        duration: userPlan.duration,
        specialOfferKind: SpecialOfferKinds.PLAN_CANCEL,
      };

      await changePlan(payload);
      const latestInvoice = await getLatestInvoice(undefined);
      if (payload.type !== PlanTypes.FREE) {
        FacebookPixel.firePlanChangeEvent(payload);
      }

      if (isNotEmpty(latestInvoice)) {
        DataLayerAnalytics.fireSubscriptionEvent(
          `${payload.type} ${payload.duration}`,
          latestInvoice.transactionId,
        );
      }

      Toast.success('Plan has been successfully changed.');
      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    changePlan,
    getLatestInvoice,
    getSubscriptionData,
    userPlan.duration,
    userPlan.type,
  ]);

  const [showSubscriptionCancelModal, hideSubscriptionCancelModal] = useModal(
    () => (
      <CancelPlanModal
        onClose={hideSubscriptionCancelModal}
        onSubmitDiscountIncrease={handleChangePlan}
        isDiscountIncreaseLoading={isChangePlanLoading}
      />
    ),
    [],
  );

  useEffect(() => {
    handlePlansGet();
    handleInvoicesGet();
    handleSubscriptionDataGet();
  }, [handleInvoicesGet, handlePlansGet, handleSubscriptionDataGet]);

  const handleOpenBillingPortal = useCallback(async () => {
    try {
      const response = await createBillingPortal(undefined);

      if (isNotEmpty(response)) {
        openNewTab(response.checkoutUrl);
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [createBillingPortal, openNewTab]);

  return (
    <div className="billing">
      <div className="settings__block">
        <h1 className="settings__title">Card Details</h1>
        <div
          className={classNames('billing__card settings__block--small', {
            mobile: isMobile,
          })}
        >
          <PastDueForm />
        </div>
        <div
          className={classNames('billing__card settings__block--small', {
            mobile: isMobile,
          })}
        >
          <CardForm />
        </div>
      </div>
      {ltdTierId ? (
        <div className="settings__block">
          <LifeTimeDealInfoBlock ltdId={ltdTierId} />
        </div>
      ) : (
        <div className="settings__block">
          <SubscriptionInfoBlockMobile
            appSumoStatus={appSumoStatus}
            subscriptionInfo={subscriptionInfo}
            plan={userPlan}
            isFreezed={status === UserStatuses.FREEZE}
          />
        </div>
      )}
      {appSumoStatus && (
        <div className="settings__block">
          <AppSumoBillingTable isAlignLeftTitle />
        </div>
      )}
      <div className="settings__block">
        <div className={classNames('billing__details-section', { mobile: isMobile })}>
          <BillingDetails />
        </div>
      </div>
      <div className="settings__block">
        <InvoiceTable
          invoiceItems={invoices}
          isLoading={isInvoicesLoading}
          requestOrdering={requestOrdering}
          paginationProps={paginationProps}
          setPageNumber={setPageNumber}
        />
        <UIButton
          priority="secondary"
          className="settings__button-cancel"
          title="Open Billing Portal"
          handleClick={handleOpenBillingPortal}
          isLoading={isCreatingBillingPortal}
          disabled={isCreatingBillingPortal}
        />
      </div>
      {!appSumoStatus && !ltdTierId && (
        <div className="settings__block">
          <div className="billing__header">Cancel subscription</div>
          <div className={classNames('billing__details-description', { mobile: true })}>
            <p className="settings__text settings__text--grey">
              If you want to cancel subscription, please do it here.
            </p>
          </div>
          <UIButton
            priority="secondary"
            className="settings__button-cancel"
            title="Cancel subscription"
            handleClick={showSubscriptionCancelModal}
            disabled={
              userPlan.type === PlanTypes.FREE ||
              userPlan.duration === PlanDurations.FOREVER ||
              !subscriptionInfo.neverExpires
            }
          />
        </div>
      )}
    </div>
  );
};

export default BillingMainScreen;
