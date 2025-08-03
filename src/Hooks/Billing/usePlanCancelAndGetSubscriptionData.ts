import { useCallback } from 'react';
import { PlanCancelFormValues } from 'Interfaces/Billing';
import Toast from 'Services/Toast';
import { usePlanCancel, useSubscriptionDataGet } from '.';

interface PlanCancelAndGetSubscriptionDataParams {
  onSubscriptionCancel?: () => void;
}

export default ({
  onSubscriptionCancel,
}: PlanCancelAndGetSubscriptionDataParams = {}) => {
  const [cancelPlan, isCancellingPlan] = usePlanCancel();
  const [getSubscriptionData, isGettingSubscriptionData] = useSubscriptionDataGet();

  const handleSubscriptionCancel = useCallback(
    async (values: PlanCancelFormValues) => {
      try {
        const { step, ...restFormValues } = values;
        await cancelPlan(restFormValues);
        onSubscriptionCancel?.();
        Toast.success('Subscription has been successfully cancelled.');
        await getSubscriptionData(undefined);
      } catch (error) {
        Toast.handleErrors(error);
        onSubscriptionCancel?.();
      }
    },
    [cancelPlan, getSubscriptionData, onSubscriptionCancel],
  );

  return {
    handleSubscriptionCancel,
    isLoading: isCancellingPlan || isGettingSubscriptionData,
  };
};
