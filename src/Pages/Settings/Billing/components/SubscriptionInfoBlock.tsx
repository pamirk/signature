import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import History from 'Services/History';
import {
  SubscriptionInfo,
  PlanDurations,
  PlanTypes,
  PlanDetails,
  AppSumoStatus,
} from 'Interfaces/Billing';
import { isNotEmpty } from 'Utils/functions';
import { capitalize } from 'lodash';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SubscriptionInfoProps {
  subscriptionInfo: SubscriptionInfo;
  plan: PlanDetails;
  appSumoStatus: AppSumoStatus;
}

export const subscriptionPlanNames = {
  [PlanTypes.FREE]: 'Free',
  [PlanTypes.PERSONAL]: 'Personal',
  [PlanTypes.BUSINESS]: 'Business',
};

export const convertToMoneyFormat = (value: number) =>
  value.toLocaleString('en', {
    useGrouping: false,
    minimumFractionDigits: 2,
  });

const SubscriptionInfoBlock = ({
  subscriptionInfo,
  plan,
  appSumoStatus,
}: SubscriptionInfoProps) => {
  const handleUpgradeClick = useCallback(() => {
    if (appSumoStatus === AppSumoStatus.FULL) {
      History.push(AuthorizedRoutePaths.SETTINGS_API);
    } else {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
    }
  }, [appSumoStatus]);
  const { userQuantity, amount, discountQuantity, discountAmount } = subscriptionInfo;
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

  return (
    <div className="billing__plan settings__block--small">
      <div
        className={classNames('settings__block billing__plan-wrapper', {
          'billing--free-plan': !isSubscribed,
          'billing--no-discount': !discountQuantity,
        })}
      >
        <div
          className={classNames('billing__plan-group billing__plan-group--head', {
            'billing--free-plan': !isSubscribed,
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
          <div className="billing__plan-button">
            <UIButton
              priority="primary"
              handleClick={handleUpgradeClick}
              title={`Upgrade ${appSumoStatus === AppSumoStatus.FULL ? 'API' : 'Plan'}`}
            />
          </div>
        </div>
        {isSubscribed && (
          <>
            <div className="billing__plan-group billing__plan-group--price">
              <div className="settings__subtitle">
                {userQuantity} {capitalize(plan.type)} Users &nbsp;
                <span className="settings__text--grey">({userQuantity} assigned)</span>
              </div>
              <div className="settings__subtitle settings__text--grey">${price} USD</div>
            </div>
            {!!discountQuantity && (
              <div className="billing__plan-group">
                <div className="settings__subtitle">
                  {!appSumoStatus ? '20% OFF ' : ''}
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
        <div className="billing__plan-group">
          <p className="settings__text settings__subtitle billing__plan-total-price">
            Total per {totalDurationType}
          </p>
          <div className="settings__text settings__text--bolder">{totalPrice} USD</div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionInfoBlock;
