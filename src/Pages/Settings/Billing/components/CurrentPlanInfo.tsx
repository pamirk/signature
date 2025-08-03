import React, { useCallback, useMemo } from 'react';
import { daysToDate, formatDateToStringForTrialInfo } from 'Utils/formatters';
import { useSelector } from 'react-redux';
import { selectSubscriptionInfo, selectUserPlan } from 'Utils/selectors';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { isExpired } from 'Utils/functions';
import { convertToMoneyFormat } from './SubscriptionInfoBlock';

const CurrentPlanInfo = () => {
  const currentPlan = useSelector(selectUserPlan);
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const isMobile = useIsMobile();

  const {
    userQuantity,
    amount,
    discountQuantity,
    discountAmount,
    trialEnd,
    nextBillingDate,
  } = subscriptionInfo;

  const totalPrice = useMemo(() => {
    const price = userQuantity * amount;
    const totalDiscount = discountQuantity ? discountQuantity * discountAmount : 0;

    return convertToMoneyFormat(price - totalDiscount);
  }, [userQuantity, amount, discountQuantity, discountAmount]);

  const showInfoContent = useCallback(() => {
    return (
      <div className="billing__trial-row">
        <div className="billing__trial-column">
          <p className="billing__trial-header">{currentPlan.name} Plan</p>
          {trialEnd && !isExpired(trialEnd) && (
            <p className="billing__trial-header-subheader">
              Your 7-day free trial ends in {daysToDate(trialEnd)} days
            </p>
          )}
          <p>
            Your next bill is for ${totalPrice} on{' '}
            {formatDateToStringForTrialInfo(nextBillingDate)}.
          </p>
        </div>
        {!isMobile && (
          <>
            <div className="billing__trial-column" />
            <div className="billing__trial-column" />
          </>
        )}
      </div>
    );
  }, [currentPlan.name, isMobile, nextBillingDate, totalPrice, trialEnd]);

  return showInfoContent();
};

export default CurrentPlanInfo;
