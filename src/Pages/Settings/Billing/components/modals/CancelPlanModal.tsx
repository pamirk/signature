import React from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import UIModal from 'Components/UIComponents/UIModal';
import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import {
  BillingCancelPlanWizardConfirmForm,
  BillingCancelPlanWizardOptionsForm,
} from 'Components/PlanCancelWizardForm';
import { usePlanCancelAndGetSubscriptionData } from 'Hooks/Billing';
import {
  PlanCancelFormValues,
  PlanDetails,
  PlanDurations,
  PlanCancelSubscriptionOption,
} from 'Interfaces/Billing';
import { CancellationReason } from 'Interfaces/UserFeedbacks';
import { User } from 'Interfaces/User';
import { selectUser, selectUserPlan } from 'Utils/selectors';

const formInitialValues: PlanCancelFormValues = {
  step: 'wizard',
  cancellationReason: undefined,
  comment: undefined,
  plannedReturnDate: undefined,
};

export interface CancelPlanModalProps extends BaseModalProps {
  onSubmitDiscountIncrease: () => void | Promise<void>;
  isDiscountIncreaseLoading: boolean;
}

export const CancelPlanModal = (props: CancelPlanModalProps) => {
  const { onClose, onSubmitDiscountIncrease, isDiscountIncreaseLoading } = props;

  const userPlan: PlanDetails = useSelector(selectUserPlan);
  const user: User = useSelector(selectUser);

  const subscriptionOption:
    | PlanCancelSubscriptionOption
    | undefined = user.isTrialSubscription
    ? 'trial'
    : userPlan?.duration === PlanDurations.MONTHLY
    ? 'monthly'
    : userPlan?.duration === PlanDurations.ANNUALLY
    ? 'yearly'
    : undefined;

  const { handleSubscriptionCancel } = usePlanCancelAndGetSubscriptionData({
    onSubscriptionCancel: onClose,
  });

  if (!subscriptionOption || !userPlan) return null;

  return (
    <UIModal onClose={onClose} className="cancelPlanModal">
      <div className="billing__plan-cancel-modal">
        <Form<PlanCancelFormValues>
          initialValues={formInitialValues}
          onSubmit={handleSubscriptionCancel}
          render={({
            form,
            handleSubmit,
            pristine,
            submitting,
            hasValidationErrors,
            values: { cancellationReason, step },
          }) => (
            <form className="billing__plan-cancel-modal-form" onSubmit={handleSubmit}>
              {cancellationReason ? (
                <BillingCancelPlanWizardConfirmForm
                  subscriptionOption={subscriptionOption}
                  cancellationReason={cancellationReason}
                  planType={userPlan.type}
                  step={step}
                  pristine={pristine}
                  isSubmitting={submitting || isDiscountIncreaseLoading}
                  hasValidationErrors={hasValidationErrors}
                  onChangeStep={() => form.change('step', 'confirm')}
                  onSubmitDiscountIncrease={() => {
                    onClose();
                    onSubmitDiscountIncrease();
                  }}
                  onCancel={onClose}
                />
              ) : (
                <BillingCancelPlanWizardOptionsForm
                  subscriptionOption={subscriptionOption}
                  onChangeCancellationReason={(cancellationReason: CancellationReason) =>
                    form.change('cancellationReason', cancellationReason)
                  }
                  onNevermind={onClose}
                />
              )}
            </form>
          )}
        />
      </div>
    </UIModal>
  );
};

export default CancelPlanModal;
