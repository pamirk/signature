import React, { PropsWithChildren } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { PlanCancelSubscriptionOption, PlanTypes } from 'Interfaces/Billing';

type BillingCancelPlanWizardSubscriptionOptionsProps =
  | {
      subscriptionOption: Extract<PlanCancelSubscriptionOption, 'trial'>;
      subscriptionEndDate?: string;
    }
  | {
      subscriptionOption: Exclude<PlanCancelSubscriptionOption, 'trial'>;
      subscriptionEndDate: string;
    };

type BillingCancelPlanWizardLoseSubscriptionProps = {
  onCancel?: () => void;
  isSubmitting?: boolean;
  hasValidationErrors?: boolean;
  planType: PlanTypes;
} & BillingCancelPlanWizardSubscriptionOptionsProps;

const BillingCancelPlanWizardLoseSubscription = ({
  children,
  isSubmitting,
  hasValidationErrors,
  onCancel,
  planType,
  subscriptionOption,
  subscriptionEndDate,
}: PropsWithChildren<BillingCancelPlanWizardLoseSubscriptionProps>) => {
  const isTrial = subscriptionOption === 'trial';
  const isPersonalPlan = planType === PlanTypes.PERSONAL;
  const isBusinessPlan = planType === PlanTypes.BUSINESS;

  return (
    <>
      <h1 className="billing__plan-cancel-modal-title">
        {isPersonalPlan ? "We're Sad" : 'Sorry'} to See You Go
      </h1>
      {isTrial ? (
        <p className="billing__plan-cancel-modal-paragraph" key="trial">
          If you cancel your subscription, you will immediately lose access to the{' '}
          {isPersonalPlan ? 'Personal Plan' : isBusinessPlan ? 'Business Plan' : ''}{' '}
          features such as{' '}
          {isBusinessPlan
            ? 'Unlimited Templates, Unlimited Signature Requests, Signaturely Forms, Bulk Send, Custom Branding '
            : '1 Template, 5 Signature Requests '}
          and {!subscriptionEndDate ? 'more.' : `more on ${subscriptionEndDate}.`}
        </p>
      ) : isBusinessPlan ? (
        <>
          <p className="billing__plan-cancel-modal-paragraph" key="business-1">
            If you cancel now, you’ll still have access to all Business Plan features —
            including Unlimited Templates, Unlimited Signature Requests, Signaturely
            Forms, Bulk Send, Custom Branding, and more
            {!subscriptionEndDate ? '.' : ` — until ${subscriptionEndDate}.`}
          </p>
          {!!subscriptionEndDate && (
            <p className="billing__plan-cancel-modal-paragraph" key="business-2">
              After that, your account will revert to the free version and these features
              will no longer be available.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="billing__plan-cancel-modal-paragraph" key="personal-1">
            Your personal plan includes 1 Template, 5 Signature Requests, and other
            helpful features — all active
            {!subscriptionEndDate ? '.' : ` until ${subscriptionEndDate}.`}
          </p>
          {!!subscriptionEndDate && (
            <p className="billing__plan-cancel-modal-paragraph" key="personal-2">
              If you cancel, you’ll lose access after that date, and any saved templates
              or usage history may be removed.
            </p>
          )}
        </>
      )}
      {children}
      <div className="billing__plan-cancel-modal-actions">
        <UIButton
          priority="primary"
          title="Nevermind"
          className="billing__plan-cancel-modal-button--primary"
          handleClick={onCancel}
        />
        <UIButton
          priority="white"
          title="Cancel Subscription"
          className="billing__plan-cancel-modal-button--white"
          type="submit"
          disabled={hasValidationErrors}
          isLoading={isSubmitting}
        />
      </div>
    </>
  );
};

export default BillingCancelPlanWizardLoseSubscription;
