import React, { useCallback } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import { Plan, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { capitalize } from 'lodash';
import UIButton from 'Components/UIComponents/UIButton';
import { DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import {
  useLtdPlanDurationChange,
  useLatestInvoiceGet,
  useSubscriptionDataGet,
} from 'Hooks/Billing';

interface LtdDowngradePlanProps {
  onClose: () => void;
  nextBillingDate: Date;
}

const planToChange: Plan = {
  type: PlanTypes.BUSINESS,
  duration: PlanDurations.MONTHLY,
  title: 'Business',
};

const LtdDowngradePlanModal = ({ onClose, nextBillingDate }: LtdDowngradePlanProps) => {
  const [getLatestInvoice] = useLatestInvoiceGet();
  const [getSubscriptionData] = useSubscriptionDataGet();
  const [
    changeLtdPlanDuration,
    isChangeLtdPlanDurationLoading,
  ] = useLtdPlanDurationChange();

  const handleChangePlan = useCallback(async () => {
    try {
      await changeLtdPlanDuration({ duration: planToChange.duration });

      const latestInvoice = await getLatestInvoice(undefined);

      if (isNotEmpty(latestInvoice)) {
        DataLayerAnalytics.fireSubscriptionEvent(
          `${planToChange.type} ${planToChange.duration}`,
          latestInvoice.transactionId,
        );
      }

      Toast.success('Plan has been successfully changed.');
      await getSubscriptionData(undefined);
      onClose();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [changeLtdPlanDuration, getLatestInvoice, getSubscriptionData, onClose]);

  return (
    <UIModal onClose={onClose} className="downgradePlanModal">
      <div className="downgradePlanModal__container">
        <div className="downgradePlanModal__title">
          Downgrade to {capitalize(planToChange.type)} {capitalize(planToChange.duration)}{' '}
          Plan
        </div>
        <div className="downgradePlanModal__text">
          We will downgrade your plan at the next billing date (
          {nextBillingDate.toDateString()})
        </div>
        <div className="downgradePlanModal__button">
          <UIButton
            priority="primary"
            title="Downgrade"
            handleClick={handleChangePlan}
            isLoading={isChangeLtdPlanDurationLoading}
            disabled={isChangeLtdPlanDurationLoading}
          />
        </div>
      </div>
    </UIModal>
  );
};

export default LtdDowngradePlanModal;
