import React, { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import History from 'Services/History';
import {
  SubscriptionInfo,
  PlanDurations,
  PlanDetails,
  AppSumoStatus,
  PlanTypes,
} from 'Interfaces/Billing';
import { isNotEmpty } from 'Utils/functions';
import { capitalize } from 'lodash';
import { convertToMoneyFormat, subscriptionPlanNames } from './SubscriptionInfoBlock';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { useSelector } from 'react-redux';
import { selectCardFormValues, selectTeamMembers, selectUserPlan } from 'Utils/selectors';
import useTeamMembersGet from 'Hooks/Team/useTeamMembersGet';
import { OrderingDirection } from 'Interfaces/Common';
import { useModal } from 'react-modal-hook';
import LtdUpgradePlanModal from './modals/LtdUpgradePlanModal';
import AppSumoDowngradePlanModal from './modals/AppSumoDowngradePlanModal';
import Toast from 'Services/Toast';
import { useLtdPlanDurationChange, useSubscriptionDataGet } from 'Hooks/Billing';
import { APPSUMO_STANDARD_TEAM_LIMIT } from 'Utils/constants';

interface SubscriptionInfoMobileProps {
  subscriptionInfo: SubscriptionInfo;
  plan: PlanDetails;
  appSumoStatus: AppSumoStatus;
  isFreezed?: boolean;
}

const SubscriptionInfoBlock = ({
  subscriptionInfo,
  plan,
  appSumoStatus,
  isFreezed: pastDue,
}: SubscriptionInfoMobileProps) => {
  const isMobile = useIsMobile();
  const [getTeamMembers] = useTeamMembersGet();
  const [changeLtdPlanDuration] = useLtdPlanDurationChange();
  const [getSubscriptionData] = useSubscriptionDataGet();
  const teamMembers = useSelector(selectTeamMembers);
  const cardInitialValues = useSelector(selectCardFormValues);
  const userPlan = useSelector(selectUserPlan);

  const [assignedTeamMembers, additionalTeamMembers] = useMemo(() => {
    const assignedTeamMembers =
      teamMembers.length <= APPSUMO_STANDARD_TEAM_LIMIT
        ? teamMembers.length
        : APPSUMO_STANDARD_TEAM_LIMIT;
    const additionalTeamMembers =
      teamMembers.length > APPSUMO_STANDARD_TEAM_LIMIT
        ? teamMembers.length - APPSUMO_STANDARD_TEAM_LIMIT
        : 0;

    return [assignedTeamMembers, additionalTeamMembers];
  }, [teamMembers]);

  const [showLtdUpgradePlanModal, hideLtdUpgradePlanModal] = useModal(
    () => (
      <LtdUpgradePlanModal onClose={hideLtdUpgradePlanModal} isUpgradingPlan={true} />
    ),
    [userPlan, cardInitialValues],
  );

  const [showAppSumoDowngradePlanModal, hideAppSumoDowngradePlanModal] = useModal(
    () => (
      <AppSumoDowngradePlanModal
        onClose={hideAppSumoDowngradePlanModal}
        nextBillingDate={new Date(subscriptionInfo.nextBillingDate)}
      />
    ),
    [subscriptionInfo],
  );

  const handleRenewPlan = useCallback(async () => {
    try {
      await changeLtdPlanDuration({ duration: userPlan.duration });
      await getSubscriptionData(undefined);
      Toast.success('Plan has been renew');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [changeLtdPlanDuration, getSubscriptionData, userPlan.duration]);

  const showAppSumoModalByDuration = useCallback(() => {
    if (isNotEmpty(subscriptionInfo) && !subscriptionInfo.neverExpires) {
      handleRenewPlan();
    } else if (userPlan.duration === PlanDurations.ANNUALLY) {
      showAppSumoDowngradePlanModal();
    } else {
      showLtdUpgradePlanModal();
    }
  }, [
    handleRenewPlan,
    showAppSumoDowngradePlanModal,
    showLtdUpgradePlanModal,
    subscriptionInfo,
    userPlan.duration,
  ]);

  const handleUpgradeClick = useCallback(() => {
    if (appSumoStatus === AppSumoStatus.FULL) {
      History.push(AuthorizedRoutePaths.SETTINGS_API);
    } else {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
    }
  }, [appSumoStatus]);
  const {
    userQuantity,
    amount,
    discountQuantity,
    discountAmount,
    discountPercent,
  } = subscriptionInfo;
  const isSubscribed = isNotEmpty(subscriptionInfo);

  const {
    price,
    totalDiscount,
    totalPrice,
    billingDurationType,
    totalDurationType,
  } = useMemo(() => {
    const price = userQuantity * amount;
    const totalDiscount = discountQuantity ? discountQuantity * discountAmount : 0;

    return {
      price: convertToMoneyFormat(price),
      totalDiscount: convertToMoneyFormat(totalDiscount),
      totalPrice: convertToMoneyFormat(price - totalDiscount),
      billingDurationType: plan.duration ? `(Billed ${capitalize(plan.duration)})` : '',
      totalDurationType: plan.duration === PlanDurations.ANNUALLY ? 'Year' : 'Month',
    };
  }, [userQuantity, amount, discountQuantity, discountAmount, plan]);

  const getUpdateButtonTitle = useCallback(() => {
    if (isNotEmpty(subscriptionInfo) && !subscriptionInfo.neverExpires)
      return 'Renew Plan';

    if (plan.type === PlanTypes.BUSINESS) return 'Edit Plan';

    if (appSumoStatus === AppSumoStatus.FULL) return 'Upgrade API';

    return 'Upgrade Plan';
  }, [appSumoStatus, plan.type, subscriptionInfo]);

  const getAppSumoUpdateButtonTitle = useCallback(() => {
    if (isNotEmpty(subscriptionInfo) && !subscriptionInfo.neverExpires)
      return 'Renew Plan';

    if (
      appSumoStatus === AppSumoStatus.STANDARD &&
      userPlan.duration !== PlanDurations.ANNUALLY
    )
      return 'Upgrade Plan';

    return 'Downgrade';
  }, [appSumoStatus, subscriptionInfo, userPlan.duration]);

  const getNextInvoiceTitle = useCallback(() => {
    const dateString = new Date(subscriptionInfo.nextBillingDate).toDateString();

    if (!subscriptionInfo.neverExpires) {
      return `Your plan will end on ${dateString}`;
    }

    return `Your next payment is due on ${dateString}`;
  }, [subscriptionInfo.neverExpires, subscriptionInfo.nextBillingDate]);

  useEffect(() => {
    getTeamMembers({
      orderingKey: 'role',
      orderingDirection: OrderingDirection.DESC.toUpperCase(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classNames('billing__plan settings__block--small', { mobile: isMobile })}
    >
      <div
        className={classNames('settings__block billing__plan-wrapper', {
          'billing--free-plan': !isSubscribed,
          'billing--no-discount': !discountQuantity,
        })}
      >
        <div
          className={classNames('billing__plan-group billing__plan-group--head', {
            'billing--free-plan': !isSubscribed,
            mobile: isMobile,
          })}
        >
          <div className="billing__plan-description">
            <p className="billing__plan-title settings__text--grey">
              Your plan {!appSumoStatus && billingDurationType}
            </p>
            <p className="settings__text settings__text--bold">
              {appSumoStatus === AppSumoStatus.STANDARD
                ? 'AppSumo 1 code'
                : appSumoStatus === AppSumoStatus.FULL
                ? 'AppSumo 2 code'
                : subscriptionPlanNames[plan.type]}
            </p>
          </div>
          {(!isMobile || !isSubscribed) && !appSumoStatus && (
            <div className={classNames('billing__plan-button', { mobile: isMobile })}>
              <UIButton
                priority="primary"
                handleClick={handleUpgradeClick}
                title={getUpdateButtonTitle()}
                disabled={pastDue}
              />
            </div>
          )}
          {appSumoStatus && isSubscribed && (
            <div className={classNames('billing__plan-button', { mobile: isMobile })}>
              <UIButton
                priority="primary"
                handleClick={showAppSumoModalByDuration}
                title={getAppSumoUpdateButtonTitle()}
              />
            </div>
          )}
        </div>
        {isSubscribed && (
          <>
            <div className="billing__plan-group billing__plan-group--price">
              <div className="settings__subtitle">
                {appSumoStatus ? '3 LTD' : `${userQuantity} ${capitalize(plan.type)}`}{' '}
                Users &nbsp;
                <span className="settings__text--grey">
                  ({appSumoStatus ? assignedTeamMembers : userQuantity} assigned)
                </span>
              </div>
              <div className="settings__subtitle settings__text--grey">
                ${appSumoStatus ? 0 : price} USD
              </div>
            </div>
            {appSumoStatus && (
              <div className="billing__plan-group billing__plan-group--price">
                <div className="settings__subtitle">
                  {additionalTeamMembers} Additional User
                </div>
                <div className="settings__subtitle settings__text--grey">
                  ${price ? price : 0} USD
                </div>
              </div>
            )}
            {!!discountQuantity && (
              <div className="billing__plan-group">
                <div className="settings__subtitle">
                  {discountPercent ? `${discountPercent}% OFF ` : ''}
                  Discount
                </div>
                <div className="settings__subtitle settings__text--green">
                  -${totalDiscount} USD
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {isSubscribed && (
        <>
          <div className={classNames('billing__plan-group total', { mobile: isMobile })}>
            <div className="settings__text settings__subtitle billing__plan-total-price">
              Total per {totalDurationType}
            </div>
            <div className="billing__plan-group--amount">
              <div className="settings__text settings__text--bolder">
                ${totalPrice} USD
              </div>
            </div>
          </div>
          {isMobile && !appSumoStatus && (
            <div className="billing__plan-button mobile">
              <UIButton
                priority="primary"
                handleClick={handleUpgradeClick}
                title={getUpdateButtonTitle()}
                disabled={pastDue}
              />
            </div>
          )}
          <div className="billing__plan-group billing__plan-group--next-invoice">
            <span
              className={classNames(
                subscriptionInfo.neverExpires
                  ? 'settings__text--grey'
                  : 'settings__text--red',
              )}
            >
              {getNextInvoiceTitle()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionInfoBlock;
