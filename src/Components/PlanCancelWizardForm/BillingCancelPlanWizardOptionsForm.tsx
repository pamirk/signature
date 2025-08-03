import React from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import { PlanCancelSubscriptionOption } from 'Interfaces/Billing';
import { CancellationReason } from 'Interfaces/UserFeedbacks';
import { optionsDataByUserPlan } from './common/optionsData';

export interface BillingCancelPlanWizardOptionsFormProps {
  subscriptionOption: PlanCancelSubscriptionOption;
  onChangeCancellationReason: (cancellationReason: CancellationReason) => void;
  onNevermind: () => void;
}

export const BillingCancelPlanWizardOptionsForm = (
  props: BillingCancelPlanWizardOptionsFormProps,
) => {
  const { subscriptionOption, onChangeCancellationReason, onNevermind } = props;

  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">
        Why did you decide to cancel your Signaturely subscription?
      </h1>
      <div className="billing__plan-cancel-modal-options">
        {optionsDataByUserPlan[subscriptionOption].map(option => (
          <article key={option.id} className="billing__plan-cancel-modal-option-wrapper">
            <button
              className="billing__plan-cancel-modal-option"
              type="button"
              onClick={() => onChangeCancellationReason(option.cancellationReason)}
            >
              <div className="billing__plan-cancel-modal-option-content">
                <ReactSVG src={option.icon} />
              </div>
              <p className="billing__plan-cancel-modal-option-description">
                {option.description}
              </p>
            </button>
          </article>
        ))}
      </div>
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Nevermind"
          className="billing__plan-cancel-modal-button--primary"
          handleClick={() => onNevermind()}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardOptionsForm;
