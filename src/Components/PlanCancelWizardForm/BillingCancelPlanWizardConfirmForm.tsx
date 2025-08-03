import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  PlanCancelSubscriptionOption,
  PlanCancelFormValues,
  PlanTypes,
} from 'Interfaces/Billing';
import { CancellationReason } from 'Interfaces/UserFeedbacks';
import { DateFormats } from 'Interfaces/User';
import { selectSubscriptionInfo } from 'Utils/selectors';
import {
  BillingCancelPlanWizardYourThoughtsForm,
  BillingCancelPlanWizardPersonalDifficultToUse,
  BillingCancelPlanWizardFinancialReason,
  BillingCancelPlanWizardReturnDateForm,
  BillingCancelPlanWizardLoseSubscription,
} from '.';
import {
  discountOrLess,
  financialReasonPeriodBySubscriptionOption,
} from './common/discountsData';

const navigateToHelpCenter = () => {
  window.location.href = 'https://help.signaturely.com/';
};

export interface BillingCancelPlanWizardConfirmFormProps {
  subscriptionOption: PlanCancelSubscriptionOption;
  cancellationReason: CancellationReason;
  planType: PlanTypes;
  step: PlanCancelFormValues['step'];
  pristine?: boolean;
  isSubmitting?: boolean;
  hasValidationErrors?: boolean;
  onChangeStep: () => void;
  onSubmitDiscountIncrease: () => void;
  onCancel?: () => void;
}

const BillingCancelPlanWizardConfirmForm = ({
  step,
  planType,
  subscriptionOption,
  cancellationReason,
  pristine,
  isSubmitting,
  hasValidationErrors,
  onChangeStep,
  onSubmitDiscountIncrease,
  onCancel,
}: BillingCancelPlanWizardConfirmFormProps) => {
  const subscriptionInfo = useSelector(selectSubscriptionInfo);

  const subscriptionEndDate = useMemo(() => {
    return subscriptionInfo && subscriptionInfo.nextBillingDate
      ? dayjs(subscriptionInfo.nextBillingDate).format(DateFormats.MM_DD_YYYY)
      : undefined;
  }, [subscriptionInfo]);

  const targetDiscount = useMemo(() => {
    return discountOrLess(subscriptionInfo.discountPercent, subscriptionOption);
  }, [subscriptionOption, subscriptionInfo.discountPercent]);

  const fallbackPage = useMemo(
    () => (
      <BillingCancelPlanWizardYourThoughtsForm
        onCancel={() => onCancel?.()}
        onSubmit={onChangeStep}
        isSubmitting={isSubmitting}
      />
    ),
    [onChangeStep, isSubmitting, onCancel],
  );

  return subscriptionOption === 'trial' ? (
    step === 'wizard' ? (
      cancellationReason === CancellationReason.DIFFICULT_TO_USE ? (
        <BillingCancelPlanWizardPersonalDifficultToUse
          onCancel={navigateToHelpCenter}
          onSubmit={onChangeStep}
        />
      ) : cancellationReason === CancellationReason.PRICING ? (
        targetDiscount ? (
          <BillingCancelPlanWizardFinancialReason
            discount={targetDiscount}
            period={financialReasonPeriodBySubscriptionOption(subscriptionOption)}
            planType={planType}
            onCancel={onChangeStep}
            onSubmit={onSubmitDiscountIncrease}
          />
        ) : (
          <BillingCancelPlanWizardLoseSubscription
            onCancel={() => onCancel?.()}
            isSubmitting={isSubmitting}
            hasValidationErrors={hasValidationErrors}
            planType={planType}
            subscriptionOption={subscriptionOption}
          />
        )
      ) : (
        fallbackPage
      )
    ) : (
      <BillingCancelPlanWizardLoseSubscription
        onCancel={() => onCancel?.()}
        isSubmitting={isSubmitting}
        hasValidationErrors={hasValidationErrors}
        planType={planType}
        subscriptionOption={subscriptionOption}
      />
    )
  ) : subscriptionOption === 'monthly' ? (
    step === 'wizard' ? (
      cancellationReason === CancellationReason.DIFFICULT_TO_USE ? (
        <BillingCancelPlanWizardPersonalDifficultToUse
          onCancel={navigateToHelpCenter}
          onSubmit={onChangeStep}
        />
      ) : cancellationReason === CancellationReason.PRICING ? (
        targetDiscount ? (
          <BillingCancelPlanWizardFinancialReason
            discount={targetDiscount}
            period={financialReasonPeriodBySubscriptionOption(subscriptionOption)}
            planType={planType}
            onCancel={onChangeStep}
            onSubmit={onSubmitDiscountIncrease}
          />
        ) : (
          <BillingCancelPlanWizardLoseSubscription
            onCancel={() => onCancel?.()}
            isSubmitting={isSubmitting}
            hasValidationErrors={hasValidationErrors}
            planType={planType}
            subscriptionOption={subscriptionOption}
            subscriptionEndDate={subscriptionEndDate as string}
          />
        )
      ) : (
        fallbackPage
      )
    ) : (
      <BillingCancelPlanWizardLoseSubscription
        onCancel={() => onCancel?.()}
        isSubmitting={isSubmitting}
        hasValidationErrors={hasValidationErrors}
        planType={planType}
        subscriptionOption={subscriptionOption}
        subscriptionEndDate={subscriptionEndDate as string}
      />
    )
  ) : subscriptionOption === 'yearly' ? (
    step === 'wizard' ? (
      cancellationReason === CancellationReason.NOT_ENOUGH_USE ? (
        <BillingCancelPlanWizardPersonalDifficultToUse
          onCancel={navigateToHelpCenter}
          onSubmit={onChangeStep}
        />
      ) : cancellationReason === CancellationReason.HAVING_A_BREAK ? (
        <BillingCancelPlanWizardReturnDateForm
          onCancel={onChangeStep}
          pristine={pristine}
          isSubmitting={isSubmitting}
          hasValidationErrors={hasValidationErrors}
        />
      ) : cancellationReason === CancellationReason.FINANCIAL_TROUBLE ? (
        targetDiscount ? (
          <BillingCancelPlanWizardFinancialReason
            discount={targetDiscount}
            period={financialReasonPeriodBySubscriptionOption(subscriptionOption)}
            planType={planType}
            onCancel={onChangeStep}
            onSubmit={onSubmitDiscountIncrease}
          />
        ) : (
          <BillingCancelPlanWizardLoseSubscription
            onCancel={() => onCancel?.()}
            isSubmitting={isSubmitting}
            hasValidationErrors={hasValidationErrors}
            planType={planType}
            subscriptionOption={subscriptionOption}
            subscriptionEndDate={subscriptionEndDate as string}
          />
        )
      ) : (
        fallbackPage
      )
    ) : (
      <BillingCancelPlanWizardLoseSubscription
        onCancel={() => onCancel?.()}
        isSubmitting={isSubmitting}
        hasValidationErrors={hasValidationErrors}
        planType={planType}
        subscriptionOption={subscriptionOption}
        subscriptionEndDate={subscriptionEndDate as string}
      />
    )
  ) : (
    fallbackPage
  );
};

export default BillingCancelPlanWizardConfirmForm;
