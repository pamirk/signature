import React, { PropsWithChildren } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { PlanTypes } from 'Interfaces/Billing';

interface BillingCancelPlanWizardFinancialReasonProps {
  period: 'monthly' | 'yearly';
  planType: PlanTypes;
  discount: number;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const BillingCancelPlanWizardFinancialReason = (
  props: PropsWithChildren<BillingCancelPlanWizardFinancialReasonProps>,
) => {
  const { children, period, planType, discount, onCancel, onSubmit } = props;
  const isBusinessPlan = planType === PlanTypes.BUSINESS;

  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">A Special offer just for you!</h1>
      <p className="billing__plan-cancel-modal-paragraph">
        We&apos;re offering you a {discount}% discount on our {period} plan, making it
        easier to enjoy all the benefits of Signaturely
        {isBusinessPlan ? ', like Unlimited Templates and Custom Branding,' : ''} at a
        reduced price. Ready to save and continue seamlessly managing your documents?
      </p>
      {children}
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Yes, I'm Interested"
          className="billing__plan-cancel-modal-button--primary"
          handleClick={onSubmit}
        />
        <UIButton
          priority="white"
          title="No, thank you"
          className="billing__plan-cancel-modal-button--white"
          handleClick={onCancel}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardFinancialReason;
