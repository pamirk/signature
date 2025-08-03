import React, { PropsWithChildren } from 'react';
import UIButton from 'Components/UIComponents/UIButton';

interface BillingCancelPlanWizardPersonalDifficultToUseProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

const BillingCancelPlanWizardPersonalDifficultToUse = (
  props: PropsWithChildren<BillingCancelPlanWizardPersonalDifficultToUseProps>,
) => {
  const { children, onCancel, onSubmit } = props;

  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">Sorry to hear that</h1>
      <p className="billing__plan-cancel-modal-paragraph">
        You were not able to get the most out of Signaturely; we&apos;ve written some
        beneficial content on how to get started with Signaturely. This information was
        created to help you get started and get all your documents signed. Would you like
        to check it out?
      </p>
      {children}
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Yes, take a look"
          className="billing__plan-cancel-modal-button--primary"
          handleClick={onCancel}
        />
        <UIButton
          priority="white"
          title="No, thank you"
          className="billing__plan-cancel-modal-button--white"
          handleClick={onSubmit}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardPersonalDifficultToUse;
