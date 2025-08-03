import React, {useState, useCallback, useEffect, useMemo, JSX} from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import Toggler from 'react-toggle';
import 'react-toggle/style.css';
import Toast from 'Services/Toast';
import { useModal } from 'Hooks/Common';
import {
  useCardGet,
  useLatestInvoiceGet,
  usePlanChange,
  usePlanUpsell,
  useSubscriptionDataGet,
  useUpsellAllowedCheck,
} from 'Hooks/Billing';
import {
  selectUserPlan,
  selectCardFormValues,
  selectUser,
  selectSubscriptionInfo,
} from 'Utils/selectors';
import {
  Plan,
  PlanTypes,
  PlanDurations,
  PlanChangePayload,
  Coupon,
  AnnuallyDiscount,
} from 'Interfaces/Billing';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';
import { headerItems, PlanFieldTypes, planInformationItems } from './planTableItems';

import UIButton from 'Components/UIComponents/UIButton';
import {
  BillingPlansSlider,
  PromoCodeModal,
  CurrentPlanInfo,
  PlanCostItem,
} from '../../components';

import ArrowCircleIcon from 'Assets/images/icons/arrow-circle.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import BillingPlanTableMobileView from '../../components/BillingPlanTableMobileView';
import { isNotEmpty, isExpired } from 'Utils/functions';
import { DataLayerAnalytics, FacebookPixel } from 'Services/Integrations';
import DowngradePlanModal from '../../components/DowngradePlanModal';
import UISpinner from 'Components/UIComponents/UISpinner';
import { PlanChangeModal } from 'Components/PlanChangeModal';
import { UpsellModal } from 'Components/UpsellModal';
import { UserStatuses, User } from 'Interfaces/User';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import History from 'Services/History';

const renderCell = (
  type: PlanFieldTypes,
  value: JSX.Element | string | number | boolean,
) =>
  type === PlanFieldTypes.BOOLEAN && value ? (
    <ReactSVG src={ArrowCircleIcon} className="billing__table-icon" />
  ) : (
    value
  );

// eslint-disable-next-line react-refresh/only-export-components
export const planPriorityByDuration = {
  [PlanDurations.MONTHLY]: {
    [PlanTypes.FREE]: 0,
    [PlanTypes.PERSONAL]: 1,
    [PlanTypes.BUSINESS]: 2,
  },
  [PlanDurations.ANNUALLY]: {
    [PlanTypes.FREE]: 0,
    [PlanTypes.PERSONAL]: 3,
    [PlanTypes.BUSINESS]: 4,
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const planMonthlyInformationItems = [
  {
    name: 'Plan Cost',
    personalValue: (
      <PlanCostItem type={PlanTypes.PERSONAL} duration={PlanDurations.MONTHLY} />
    ),
    businessValue: (
      <PlanCostItem type={PlanTypes.BUSINESS} duration={PlanDurations.MONTHLY} />
    ),
    type: PlanFieldTypes.TEXT,
  },
  ...planInformationItems,
];

// eslint-disable-next-line react-refresh/only-export-components
export const planAnnuallyInformationItems = [
  {
    name: 'Plan Cost',
    personalValue: (
      <PlanCostItem type={PlanTypes.PERSONAL} duration={PlanDurations.ANNUALLY} />
    ),
    businessValue: (
      <PlanCostItem type={PlanTypes.BUSINESS} duration={PlanDurations.ANNUALLY} />
    ),
    type: PlanFieldTypes.TEXT,
  },
  ...planInformationItems,
];

const BillingDefaultPlanScreen = () => {
  const user: User = useSelector(selectUser);
  const userPlan = useSelector(selectUserPlan);
  const cardInitialValues = useSelector(selectCardFormValues);
  const subscriptionInfo = useSelector(selectSubscriptionInfo);

  const [changePlan, isChangePlanLoading] = usePlanChange();
  const [getSubscriptionData] = useSubscriptionDataGet();
  const [upsellPlan, isUpsellingPlan] = usePlanUpsell();
  const [checkUpsellAllowed] = useUpsellAllowedCheck();
  const [getLatestInvoice] = useLatestInvoiceGet();
  const [getCard] = useCardGet();
  const isMobile = useIsMobile();

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>();
  const [currentDisplayedPlan, setCurrentDisplayedPlan] = useState<PlanTypes>(
    userPlan.type,
  );
  const [selectedPlanDuration, setSelectedPlanDuration] = useState(
    userPlan.duration || PlanDurations.MONTHLY,
  );
  const [planToChange, setPlanToUpgrade] = useState<Plan>({
    type: PlanTypes.PERSONAL,
    duration: PlanDurations.MONTHLY,
    title: 'Personal',
  });

  const planInformationItemsData =
    selectedPlanDuration === PlanDurations.MONTHLY
      ? planMonthlyInformationItems
      : planAnnuallyInformationItems;

  const planInformationItems = planInformationItemsData.map(item => {
    if (item.name === 'Documents per month') {
      return {
        ...item,
        freeValue: `${user.freeDocumentsUsedLimit}`,
        personalValue: `${user.personalDocumentsUsedLimit}`,
      };
    }
    return item;
  });

  const currentHeaderItems = useMemo(() => headerItems[selectedPlanDuration], [
    selectedPlanDuration,
  ]).map(item => {
    if (item.id === 'free') {
      return {
        ...item,
        description: item.description.replace('3', `${user.freeDocumentsUsedLimit}`),
      };
    }
    return item;
  });

  const userPlanPriority = useMemo(
    () => planPriorityByDuration[userPlan.duration][userPlan.type],
    [userPlan],
  );

  const handleUpsellPlan = useCallback(async () => {
    try {
      await upsellPlan(planToChange);

      Toast.success('Plan has been successfully upgraded.');
      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [getSubscriptionData, planToChange, upsellPlan]);

  const [showUpsellModal, hideUpsellModal] = useModal(
    () => (
      <UpsellModal
        onConfirm={handleUpsellPlan}
        onClose={hideUpsellModal}
        plan={planToChange}
        isLoading={isUpsellingPlan}
      />
    ),
    [handleUpsellPlan, isUpsellingPlan, planToChange],
  );

  const handleChangePlan = useCallback(
    async (payload: PlanChangePayload) => {
      try {
        await changePlan({ ...payload, couponId: appliedCoupon && appliedCoupon.id });
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

        if (payload.duration === PlanDurations.MONTHLY) {
          try {
            await checkUpsellAllowed(undefined);
            showUpsellModal();
            // upsell throws an error if restricted
            // eslint-disable-next-line no-empty,@typescript-eslint/no-unused-vars
          } catch (e) {}
        }
        await getSubscriptionData(undefined);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [
      appliedCoupon,
      changePlan,
      checkUpsellAllowed,
      getLatestInvoice,
      getSubscriptionData,
      showUpsellModal,
    ],
  );

  const handleRenewPlan = useCallback(async () => {
    try {
      await changePlan({ type: user.plan.type, duration: user.plan.duration });
      await getSubscriptionData(undefined);
      Toast.success('Plan has been renew');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [changePlan, getSubscriptionData, user.plan.duration, user.plan.type]);

  const handlePlanDurationChange = useCallback(
    (duration: PlanDurations) => {
      const newPlan = headerItems[duration].find(plan => plan.type === planToChange.type);
      if (!newPlan) return;
      setSelectedPlanDuration(duration);
      setPlanToUpgrade({
        duration: newPlan.duration,
        id: newPlan.id,
        title: newPlan.title,
        type: newPlan.type,
      });
    },
    [planToChange],
  );

  const handlePlanDurationTogglerChange = useCallback(event => {
    const duration = event.target.checked
      ? PlanDurations.ANNUALLY
      : PlanDurations.MONTHLY;
    setSelectedPlanDuration(duration);
  }, []);

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

  const [showDowngradePlanModal, hideDowngradePlanModal] = useModal(
    () => (
      <DowngradePlanModal
        onClose={hideDowngradePlanModal}
        plan={planToChange}
        nextBillingDate={new Date(subscriptionInfo.nextBillingDate)}
        isLoading={isChangePlanLoading}
        onDowngrade={async () => {
          await handleChangePlan({
            type: planToChange.type,
            duration: planToChange.duration,
          });
          hideDowngradePlanModal();
        }}
      />
    ),
    [subscriptionInfo, planToChange, isChangePlanLoading, handleChangePlan],
  );

  const [showUpgradePlanModal, hideUpgradePlanModal] = useModal(
    () => (
      <PlanChangeModal
        onChangePlan={handleChangePlan}
        targetPlan={planToChange}
        sourcePlan={user.plan}
        onPromoAdd={showPromoCodeModal}
        onPromoClear={handleClearCoupon}
        onClose={hideUpgradePlanModal}
        onSelectedDurationChange={handlePlanDurationChange}
        cardInitialValues={cardInitialValues}
        isLoading={isChangePlanLoading}
        appliedCouponId={appliedCoupon?.id}
        header={
          !!subscriptionInfo.trialEnd && !isExpired(subscriptionInfo.trialEnd)
            ? 'Change your plan'
            : undefined
        }
      />
    ),
    [userPlan, planToChange, cardInitialValues, handleChangePlan],
  );

  const checkIfDowngrade = useCallback(
    (type: PlanTypes, duration: PlanDurations) => {
      if (type === PlanTypes.FREE) {
        return true;
      }

      if (user.plan.type === PlanTypes.BUSINESS && type !== PlanTypes.BUSINESS) {
        return true;
      }

      if (
        user.plan.duration === PlanDurations.ANNUALLY &&
        duration !== PlanDurations.ANNUALLY
      ) {
        return true;
      }
    },
    [user],
  );

  const openModal = useCallback(
    async newPlan => {
      setPlanToUpgrade({
        type: newPlan.type,
        duration: newPlan.duration,
        title: newPlan.title,
        id: newPlan.id,
      });

      const isDowngrade = checkIfDowngrade(newPlan.type, newPlan.duration);

      if (!!subscriptionInfo.trialEnd && !isExpired(subscriptionInfo.trialEnd))
        return showUpgradePlanModal();

      return isDowngrade ? showDowngradePlanModal() : showUpgradePlanModal();
    },
    [checkIfDowngrade, showDowngradePlanModal, showUpgradePlanModal, subscriptionInfo],
  );

  const handleGetCard = useCallback(async () => {
    try {
      await getCard(undefined);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.statusCode !== HttpStatus.NOT_FOUND) {
        Toast.handleErrors(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetCard();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !isNotEmpty(subscriptionInfo) && getSubscriptionData(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    user.status === UserStatuses.FREEZE &&
      History.replace(AuthorizedRoutePaths.SETTINGS_BILLING);
  });

  return (
    <div className="billing__plan-page">
      <div className="billing__switch-container">
        <div className="billing__switch">
          <span className="billing__switch-item billing__switch-text">Monthly</span>
          <Toggler
            className="billing__switch-item"
            icons={false}
            checked={selectedPlanDuration === PlanDurations.ANNUALLY}
            onChange={handlePlanDurationTogglerChange}
          />
          <span className="billing__switch-item billing__switch-text">Annually</span>
        </div>
        <div className="billing__discount">
          {isMobile ? `Save ${AnnuallyDiscount}%` : `Save up to ${AnnuallyDiscount}%`}
        </div>
      </div>
      {subscriptionInfo.neverExpires && <CurrentPlanInfo />}
      {!isMobile ? (
        <div className="billing__info-table">
          <div className="table">
            <div className="table__container billing">
              <div className="table__innerContainer billing">
                <div className="table__row billing__table-row">
                  <div className="billing__table-column billing__table-column--header"></div>
                  {currentHeaderItems.map(headerItem => (
                    <div
                      key={headerItem.type}
                      className="billing__table-column billing__table-column--header"
                    >
                      <div className="billing__table-title">{headerItem.header}</div>
                      <div className="billing__table--description">
                        {headerItem.description}
                      </div>
                      {userPlanPriority ===
                      planPriorityByDuration[headerItem.duration][headerItem.type] ? (
                        isNotEmpty(subscriptionInfo) && !subscriptionInfo.neverExpires ? (
                          <div
                            className="billing__current-plan renew"
                            onClick={handleRenewPlan}
                          >
                            {isChangePlanLoading ? <UISpinner /> : 'Renew'}
                          </div>
                        ) : (
                          <div className="billing__current-plan">Current Plan</div>
                        )
                      ) : (
                        <div className="billing__table-button">
                          <UIButton
                            title={`${
                              userPlanPriority >
                              planPriorityByDuration[headerItem.duration][headerItem.type]
                                ? 'Select'
                                : 'Upgrade'
                            }`}
                            handleClick={() => {
                              openModal(headerItem);
                            }}
                            priority="primary"
                            isLoading={
                              isChangePlanLoading ||
                              (userPlan.type !== PlanTypes.FREE &&
                                !isNotEmpty(subscriptionInfo))
                            }
                            disabled={isChangePlanLoading}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="billing__plan-info table__row billing__table-row--borderless settings__text settings__text--bold settings__text--default-size">
                Plan Information
              </div>
              {planInformationItems.map(item => (
                <div key={item.name} className="billing__table-row table__row">
                  <div className="billing__table-column">{item.name}</div>
                  <div className="billing__table-column">
                    {renderCell(item.type, item.personalValue)}
                  </div>
                  <div className="billing__table-column">
                    {renderCell(item.type, item.businessValue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <BillingPlansSlider
            items={currentHeaderItems}
            userPlanPriority={userPlanPriority}
            planPriorityByDuration={planPriorityByDuration}
            openModal={openModal}
            currentDisplayedPlan={currentDisplayedPlan}
            handleChangeCurrentPlan={planType => setCurrentDisplayedPlan(planType)}
            onRenewPlan={handleRenewPlan}
            subscriptionInfo={subscriptionInfo}
            isLoading={isChangePlanLoading}
          />
          <div className="billing__info-table">
            <div className="table">
              <div className="table__container">
                <BillingPlanTableMobileView
                  planInformationItems={planInformationItems}
                  currentDisplayedPlan={currentDisplayedPlan}
                  renderCell={renderCell}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingDefaultPlanScreen;
