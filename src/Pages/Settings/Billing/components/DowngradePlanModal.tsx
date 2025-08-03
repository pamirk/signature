import React from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import { Plan, ApiPlan } from 'Interfaces/Billing';
import { capitalize } from 'lodash';
import UIButton from 'Components/UIComponents/UIButton';

interface DowngradePlanProps {
  onClose: () => void;
  plan: Plan | ApiPlan;
  nextBillingDate: Date;
  onDowngrade: () => void;
  isLoading?: boolean;
}

const DowngradePlanModal = ({
  onClose,
  plan,
  nextBillingDate,
  onDowngrade,
  isLoading,
}: DowngradePlanProps) => {
  return (
    <UIModal onClose={onClose} className="downgradePlanModal">
      <div className="downgradePlanModal__container">
        <div className="downgradePlanModal__title">
          Downgrade to {capitalize(plan.type)} Plan
        </div>
        <div className="downgradePlanModal__text">
          We will downgrade your plan at the next billing date (
          {nextBillingDate.toDateString()})
        </div>
        <div className="downgradePlanModal__button">
          <UIButton
            priority="primary"
            title="Downgrade"
            handleClick={onDowngrade}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </UIModal>
  );
};

export default DowngradePlanModal;
