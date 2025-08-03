import React, { useCallback, useEffect, useState } from 'react';
import {
  PlanDurations,
  ApiPlan,
  ApiPlanChangePayload,
  InvoiceTypes,
  Coupon,
  ApiPlanTypes,
  ApiSubscription,
  PlanChangePayload,
} from 'Interfaces/Billing';
import DurationSwitcher from 'Components/DurationSwitcher';
import {
  apiPlanItems,
  apiPlanPriorityByDuration,
  nonPayedPlansDescription,
} from './constants';
import ApiPlanCard from 'Components/ApiPlanCard';
import {
  BillingDetails,
  InvoiceTable,
  PromoCodeModal,
} from 'Pages/Settings/Billing/components';
import { useInvoicesGet, useCardGet } from 'Hooks/Billing';
import { useSelector } from 'react-redux';
import {
  selectApiPlan,
  selectApiSubscriptionInfo,
  selectBillingData,
  selectCardFormValues,
  selectInvoices,
  selectInvoicesPaginationData,
  selectUser,
} from 'Utils/selectors';
import Toast from 'Services/Toast';
import { useDataOrdering, useModal, usePagination } from 'Hooks/Common';
import UIButton from 'Components/UIComponents/UIButton';
import CardForm from 'Components/CardForm';
import History from 'Services/History';
import useIsMobile from 'Hooks/Common/useIsMobile';
import Slider from 'Components/Slider';
import { isNotEmpty } from 'Utils/functions';
import classNames from 'classnames';
import useApiPlanChange from 'Hooks/Billing/useApiPlanChange';
import DowngradePlanModal from 'Pages/Settings/Billing/components/DowngradePlanModal';
import { PlanChangeModal } from 'Components/PlanChangeModal';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { OrderingDirection } from 'Interfaces/Common';
import { User } from 'Interfaces/User';

const ApiPlansSection = () => {
  const isMobile = useIsMobile();
  const user: User = useSelector(selectUser);
  const billing = useSelector(selectBillingData);

  const [getInvoices, isInvoicesLoading] = useInvoicesGet();
  const [changeApiPlan, isApiPlanChanging] = useApiPlanChange();
  const [getCard] = useCardGet();
  const userApiSubscription = useSelector(selectApiSubscriptionInfo);
  const userApiPlan = useSelector(selectApiPlan);
  const invoices = useSelector(selectInvoices);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const cardInitialValues = useSelector(selectCardFormValues);

  const [selectedPlanDuration, setSelectedPlanDuration] = useState(
    (userApiPlan.duration !== PlanDurations.FOREVER && userApiPlan.duration) ||
      PlanDurations.MONTHLY,
  );
  const [planToChange, setPlanToUpgrade] = useState<ApiPlan>({
    type: ApiPlanTypes.FREE,
    duration: PlanDurations.MONTHLY,
    title: 'Free',
  });
  const { requestOrdering, orderingConfig } = useDataOrdering(invoices, {
    key: 'createdAt',
    direction: OrderingDirection.DESC,
  });
  const [paginationProps, setPageNumber] = usePagination({
    paginationSelector: selectInvoicesPaginationData,
    itemsLimit: 5,
  });

  const isAppSumo =
    userApiPlan.type === ApiPlanTypes.APPSUMO_FULL ||
    userApiPlan.type === ApiPlanTypes.APPSUMO_STANDARD;

  const isLtd = !!user.ltdTierId && userApiPlan.type === ApiPlanTypes.LTD_API_PLAN;

  const isTitaniumCustom =
    userApiPlan.type === ApiPlanTypes.TITANIUM &&
    userApiPlan.duration === PlanDurations.FOREVER;

  const isAppSumoOrFree = isAppSumo || isLtd || userApiPlan.type === ApiPlanTypes.FREE;

  const currentPlanItems = apiPlanItems[selectedPlanDuration];

  const userApiPlanPriority =
    apiPlanPriorityByDuration[userApiPlan.duration][userApiPlan.type];

  const handleInvoicesGet = useCallback(async () => {
    try {
      await getInvoices({
        types: [InvoiceTypes.API],
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

  const handleCardGet = useCallback(async () => {
    try {
      await getCard(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePlan = useCallback(
    async (payload: PlanChangePayload) => {
      try {
        const response = await changeApiPlan({
          couponId: appliedCoupon?.id,
          ...payload,
        } as ApiPlanChangePayload);

        if (isNotEmpty(response)) {
          Toast.success('Api plan have been upgraded');
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [appliedCoupon, changeApiPlan],
  );

  const handleUpdateCoupon = useCallback(coupon => setAppliedCoupon(coupon), []);
  const handleClearCoupon = useCallback(() => setAppliedCoupon(undefined), []);

  const [showPromoCodeModal, hidePromoCodeModal] = useModal(
    () => (
      <PromoCodeModal
        onClose={hidePromoCodeModal}
        plan={planToChange}
        onUpdateCoupon={handleUpdateCoupon}
      />
    ),
    [planToChange],
  );

  const handleRenewPlan = useCallback(async () => {
    try {
      await changeApiPlan({ type: userApiPlan.type, duration: userApiPlan.duration });
      Toast.success('Api plan has been renew');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [changeApiPlan, userApiPlan.duration, userApiPlan.type]);

  const [showDowngradePlanModal, hideDowngradePlanModal] = useModal(
    () => (
      <DowngradePlanModal
        onClose={hideDowngradePlanModal}
        plan={planToChange}
        isLoading={isApiPlanChanging}
        nextBillingDate={
          new Date((userApiSubscription as ApiSubscription).nextBillingDate)
        }
        onDowngrade={async () => {
          await handleChangePlan({
            type: planToChange.type,
            duration: planToChange.duration,
          });
          hideDowngradePlanModal();
        }}
      />
    ),
    [planToChange, handleChangePlan, userApiSubscription],
  );

  const handlePlanDurationChange = useCallback(
    (duration: PlanDurations) => {
      duration !== PlanDurations.FOREVER && setSelectedPlanDuration(duration);
      setPlanToUpgrade({
        ...planToChange,
        duration,
      });
    },
    [planToChange],
  );

  const [showChangeApiPlanModal, hideChangePlanModal] = useModal(
    () => (
      <PlanChangeModal
        onChangePlan={handleChangePlan}
        targetPlan={planToChange}
        sourcePlan={billing?.apiSubscription?.apiPlan || user.apiSubscription.apiPlan}
        onPromoAdd={showPromoCodeModal}
        onPromoClear={handleClearCoupon}
        onClose={hideChangePlanModal}
        onSelectedDurationChange={handlePlanDurationChange}
        cardInitialValues={cardInitialValues}
        isLoading={isApiPlanChanging}
        appliedCouponId={appliedCoupon?.id}
      />
    ),
    [userApiPlan, planToChange, changeApiPlan, isApiPlanChanging],
  );

  const checkIfDowngrade = useCallback(
    (type: ApiPlanTypes, duration: PlanDurations) => {
      if (type === ApiPlanTypes.FREE) {
        return true;
      }

      if (userApiPlan.type === ApiPlanTypes.TITANIUM && type !== ApiPlanTypes.TITANIUM) {
        return true;
      }

      if (userApiPlan.type === ApiPlanTypes.PLATINUM && type === ApiPlanTypes.GOLD) {
        return true;
      }

      if (
        userApiPlan.duration === PlanDurations.ANNUALLY &&
        duration !== PlanDurations.ANNUALLY
      ) {
        return true;
      }
    },
    [userApiPlan.duration, userApiPlan.type],
  );

  const openModal = useCallback(
    async newPlan => {
      return checkIfDowngrade(newPlan.type, newPlan.duration)
        ? showDowngradePlanModal()
        : showChangeApiPlanModal();
    },
    [checkIfDowngrade, showChangeApiPlanModal, showDowngradePlanModal],
  );

  const handleUpgradeApiPlanClick = useCallback(
    async newPlan => {
      setPlanToUpgrade({
        type: newPlan.type,
        duration: newPlan.duration,
        title: newPlan.title,
      });

      openModal(newPlan);
    },
    [openModal],
  );

  useEffect(() => {
    handleCardGet();
    handleInvoicesGet();
  }, [handleCardGet, handleInvoicesGet]);

  return (
    <div className="api-billing">
      <div className={`api-billing__header${isMobile ? '--mobile' : ''}`}>
        <div className="api-billing__title" id="api-billing__title">
          Choose your Signaturely API plan
        </div>
        <div className={`api-billing__select-duration${isMobile ? '--mobile' : ''}`}>
          <div className="api-billing__select-duration-item">
            <DurationSwitcher
              text="Monthly"
              isActive={selectedPlanDuration === PlanDurations.MONTHLY}
              onClick={() => setSelectedPlanDuration(PlanDurations.MONTHLY)}
            />
          </div>
          <div className="api-billing__select-duration-item">
            <DurationSwitcher
              text="Annually"
              isActive={selectedPlanDuration === PlanDurations.ANNUALLY}
              discountText="Save 20%"
              onClick={() => setSelectedPlanDuration(PlanDurations.ANNUALLY)}
            />
          </div>
        </div>
      </div>
      <div className="api-billing__plans-container">
        <div className="api-billing__plan-cards-container">
          {!isMobile ? (
            <>
              {currentPlanItems.map(item => {
                const isCurrent =
                  userApiPlanPriority ===
                  apiPlanPriorityByDuration[item.duration][item.type];
                return (
                  <ApiPlanCard
                    isRecuringStoped={!userApiSubscription?.neverExpires}
                    handleRenew={handleRenewPlan}
                    key={item.title}
                    item={item}
                    isCurrent={isCurrent}
                    presentRequestUsage={
                      isCurrent ||
                      (item.type === ApiPlanTypes.GOLD && (isAppSumo || isLtd))
                    }
                    presentTestRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    presentTemplateUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    onUpgrade={() => handleUpgradeApiPlanClick(item)}
                    buttonText={`${
                      userApiPlanPriority >
                      apiPlanPriorityByDuration[item.duration][item.type]
                        ? 'Select'
                        : 'Upgrade'
                    }`}
                    testRequestsMonthlyUsed={
                      userApiPlan.requestLimit -
                      (userApiSubscription?.testRequestsMonthlyUsed || 0)
                    }
                    requestsUsed={
                      (userApiSubscription?.requestLimit || userApiPlan.requestLimit) -
                      (userApiSubscription?.requestsMonthlyUsed || 0)
                    }
                    templatesUsed={userApiSubscription?.templatesCount}
                    isTitaniumCustom={isTitaniumCustom}
                  />
                );
              })}
            </>
          ) : (
            <Slider>
              {currentPlanItems.map(item => {
                const isCurrent =
                  userApiPlanPriority ===
                  apiPlanPriorityByDuration[item.duration][item.type];
                return (
                  <ApiPlanCard
                    isRecuringStoped={!userApiSubscription?.neverExpires}
                    handleRenew={handleRenewPlan}
                    key={item.title}
                    item={item}
                    isCurrent={isCurrent}
                    presentRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumo)
                    }
                    presentTestRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    presentTemplateUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    onUpgrade={() => handleUpgradeApiPlanClick(item)}
                    buttonText={`${
                      userApiPlanPriority >
                      apiPlanPriorityByDuration[item.duration][item.type]
                        ? 'Select'
                        : 'Upgrade'
                    }`}
                    testRequestsMonthlyUsed={
                      userApiPlan.requestLimit -
                      (userApiSubscription?.testRequestsMonthlyUsed || 0)
                    }
                    requestsUsed={
                      (userApiSubscription?.requestLimit || userApiPlan.requestLimit) -
                      (userApiSubscription?.requestsMonthlyUsed || 0)
                    }
                    templatesUsed={userApiSubscription?.templatesCount}
                    isTitaniumCustom={isTitaniumCustom}
                  />
                );
              })}
            </Slider>
          )}
        </div>
        {(isAppSumoOrFree || isTitaniumCustom) && (
          <div className={classNames('api-billing__extra-plan', { mobile: isMobile })}>
            <div
              className={classNames('api-billing__extra-plan-text', {
                mobile: isMobile,
              })}
            >
              <h2 className="api-billing__extra-plan-title">
                You are currently in the{' '}
                {isLtd ? `${userApiPlan.name}` : `${userApiPlan.name} plan`}
              </h2>
              <div className="settings__text settings__text--grey">
                {isTitaniumCustom ? (
                  <>
                    This plan includes all Titanium Plan features but has a limited number
                    of API Signature Requests with an indefinite validity. You have
                    <b> {userApiSubscription?.requestLimit}</b> API Signature Requests
                    left. If you want more API Requests or want to switch to another plan,
                    please contact us. Note that if you switch to another plan, your API
                    Requests will be lost.
                  </>
                ) : (
                  nonPayedPlansDescription[userApiPlan.type]
                )}
              </div>
            </div>
            {isAppSumo && (
              <UIButton
                priority="primary"
                className="api-billing__extra-plan-button"
                handleClick={() => {
                  History.push(AuthorizedRoutePaths.SETTINGS_BILLING);
                }}
                title="View AppSumo Plan"
              />
            )}
          </div>
        )}
      </div>
      <div className="api-billing__details">
        <div
          className={`billing__card settings__block--small${isMobile ? ' mobile' : ''}`}
        >
          <h1 className="settings__title">Card Details</h1>
          <CardForm />
        </div>
        <BillingDetails />
      </div>
      <InvoiceTable
        invoiceItems={invoices}
        isLoading={isInvoicesLoading}
        requestOrdering={requestOrdering}
        paginationProps={paginationProps}
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

export default ApiPlansSection;
