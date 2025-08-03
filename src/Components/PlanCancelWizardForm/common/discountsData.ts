import { PlanCancelSubscriptionOption } from 'Interfaces/Billing';

export function financialReasonPeriodBySubscriptionOption(
  subscriptionOption: PlanCancelSubscriptionOption,
): 'monthly' | 'yearly' {
  return subscriptionOption === 'yearly' ? 'yearly' : 'monthly';
}

export function targetDiscountBySubscriptionOption(
  subscriptionOption: PlanCancelSubscriptionOption,
) {
  return subscriptionOption === 'yearly' ? 30 : 15;
}

export function discountOrLess(
  currentPercent: number,
  subscriptionOption: PlanCancelSubscriptionOption,
) {
  const targetPercent = targetDiscountBySubscriptionOption(subscriptionOption);
  return currentPercent < targetPercent ? targetPercent : undefined;
}
