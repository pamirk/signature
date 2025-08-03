import React, { useState, useCallback } from 'react';
import { capitalize } from 'lodash';
import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import {
  AnnuallyDiscount,
  ApiPlan,
  ApiPlanChangePayload,
  ApiPlanTypes,
  CardFormValues,
  CreateSubscriptionCheckoutPayload,
  DefaultAnnuallyDiscount,
  defaultPlanPrices,
  discountPlanPrices,
  Plan,
  PlanChangePayload,
  PlanDurations,
  PlanTypes,
  UpcomingInvoiceTypes,
} from 'Interfaces/Billing';
import {
  useCardAttach,
  useCreateCard,
  useLatestInvoiceGet,
  useUpcomingInvoiceGet,
} from 'Hooks/Billing';
import { DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';
import UIModal from 'Components/UIComponents/UIModal';
import classNames from 'classnames';
import { Form } from 'react-final-form';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { UpcomingInvoice } from 'Pages/Settings/Billing/screens/BillingDefaultPlanScreen';
import UIButton from 'Components/UIComponents/UIButton';
import Toggler from 'react-toggle';
import { useSelector } from 'react-redux';
import { selectGrid, selectSubscriptionInfo } from 'Utils/selectors';
import { isAvailablePlanForSale, isExpired } from 'Utils/functions';
import { apiPlanPrices } from 'Components/ApiPlansSection/constants';

export interface PlanChangeModalProps extends BaseModalProps {
  targetPlan: Plan | ApiPlan;
  sourcePlan: Plan | ApiPlan;
  cardInitialValues: CardFormValues | undefined;
  appliedCouponId?: string;
  isLoading?: boolean;
  onChangePlan: (payload: PlanChangePayload | ApiPlanChangePayload) => Promise<void>;
  onPromoAdd: () => void;
  onPromoClear: () => void;
  onSelectedDurationChange: (duration: PlanDurations) => void;
  header?: string;
}

const getAnnuallyDiscount = (isApiPlan: boolean, plan: Plan | ApiPlan) => {
  const annuallyDiscount = isAvailablePlanForSale(plan.type, plan.duration)
    ? AnnuallyDiscount
    : DefaultAnnuallyDiscount;
  return isApiPlan ? 20 : annuallyDiscount;
};

const renderChangeModalText = (
  targetPlan: Plan | ApiPlan,
  sourcePlan: Plan | ApiPlan,
  isApiPlan: boolean,
) => {
  if (
    targetPlan.type === sourcePlan.type &&
    targetPlan.duration === sourcePlan.duration
  ) {
    return (
      <span style={{ color: '#7D8D98' }}>
        Continue getting your documents signed painlessly with&nbsp;
        <span style={{ fontWeight: 'bold', color: '#000' }}>
          your Signaturely {capitalize(targetPlan.type)} Plan
        </span>
        .
      </span>
    );
  }

  if (targetPlan.type === PlanTypes.PERSONAL && targetPlan.type !== sourcePlan.type) {
    return (
      <span style={{ color: '#7D8D98' }}>
        The Personal Plan will give you additional features like 5 Signature Requests and
        1 Template
      </span>
    );
  }

  if (targetPlan.type === PlanTypes.BUSINESS && targetPlan.type !== sourcePlan.type) {
    return (
      <span style={{ color: '#7D8D98' }}>
        The Business Plan will give you additional features like Unlimited Templates and
        Team Management
      </span>
    );
  }

  if (
    targetPlan.duration === PlanDurations.ANNUALLY &&
    targetPlan.duration !== sourcePlan.duration
  ) {
    const priceMonth = isApiPlan
      ? apiPlanPrices[targetPlan.type][PlanDurations.MONTHLY]
      : defaultPlanPrices[targetPlan.type][PlanDurations.MONTHLY];
    const priceYear = isApiPlan
      ? apiPlanPrices[targetPlan.type][PlanDurations.ANNUALLY]
      : discountPlanPrices[targetPlan.type][PlanDurations.ANNUALLY];
    return (
      <span style={{ color: '#7D8D98' }}>
        Instead of paying ${priceMonth}/month, you would pay only&nbsp;
        <span style={{ fontWeight: 'bold', color: '#000' }}>
          $
          {(priceMonth * (1 - getAnnuallyDiscount(isApiPlan, targetPlan) / 100)).toFixed(
            2,
          )}
          /month billed yearly (${priceYear})
        </span>
        .
      </span>
    );
  }
};

const PlanChangeModal = ({
  targetPlan,
  sourcePlan,
  cardInitialValues,
  appliedCouponId,
  isLoading,
  onChangePlan,
  onPromoAdd,
  onPromoClear,
  onSelectedDurationChange,
  onClose,
  header = 'Upgrade your plan',
}: PlanChangeModalProps) => {
  const createCard = useCreateCard();
  const [attachCard] = useCardAttach();
  const [getLatestInvoice] = useLatestInvoiceGet();
  const [getUpcomingInvoice, isLoadingUpcomingInvoice] = useUpcomingInvoiceGet();

  const [upcomingInvoice, setUpcomingInvoice] = useState<UpcomingInvoiceTypes>();
  const isMobile = useIsMobile();
  const isApiPlan = Object.values(ApiPlanTypes).includes(targetPlan.type as ApiPlanTypes);
  const { trialEnd } = useSelector(selectSubscriptionInfo);

  const grid = useSelector(selectGrid);

  const isNewPlanSame =
    targetPlan.type === sourcePlan.type && targetPlan.duration === sourcePlan.duration;

  const handleChangePlan = useCallback(
    async (values: CardFormValues) => {
      try {
        if (!cardInitialValues) {
          const token = await createCard(values);
          token && (await attachCard(token));
        }

        await onChangePlan({
          type: targetPlan.type,
          duration: targetPlan.duration,
        });

        const latestInvoice = await getLatestInvoice(undefined);

        DataLayerAnalytics.firePurchaseEvent({
          //@ts-ignore
          transaction_id: latestInvoice?.transactionId,
          //@ts-ignore
          previous_plan_name: sourcePlan.name,
          count_of_docs_saved: grid?.length,
          item: {
            item_id: targetPlan.id,
            item_name: targetPlan.title,
            currency: upcomingInvoice?.currency,
            discount: upcomingInvoice?.discount,
            item_category: 'Plan',
            item_list_id: 'plans',
            item_list_name: 'Plans',
            item_variant: upcomingInvoice?.plan?.duration,
            price: upcomingInvoice?.plan?.price,
            quantity: upcomingInvoice?.quantity,
          },
        });

        onClose();
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [
      attachCard,
      cardInitialValues,
      createCard,
      getLatestInvoice,
      grid,
      onChangePlan,
      onClose,
      sourcePlan,
      targetPlan,
      upcomingInvoice,
    ],
  );

  const handlePlanDurationChange = event => {
    const duration = event.target.checked
      ? PlanDurations.ANNUALLY
      : PlanDurations.MONTHLY;

    onSelectedDurationChange(duration);
  };

  const handleGetUpcomingInvoice = useCallback(
    async (values: CreateSubscriptionCheckoutPayload) => {
      return getUpcomingInvoice(values);
    },
    [getUpcomingInvoice],
  );

  return (
    <UIModal onClose={onClose} className="changePlanModal">
      <div className={classNames('billing__plan-modal', { mobile: isMobile })}>
        <Form
          onSubmit={handleChangePlan}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="card-form">
              <div className="billing__plan-modal-title">{header}</div>
              <div className="billing__plan-modal-subtitle">
                {renderChangeModalText(targetPlan, sourcePlan, isApiPlan)}
              </div>
              <div className="upcomingInvoice__switch-container">
                <div className="upcomingInvoice__switch">
                  <span className="upcomingInvoice__switch-item upcomingInvoice__switch-text">
                    Monthly
                  </span>
                  <Toggler
                    className="upcomingInvoice__switch-item upcomingInvoice__switch-toggler"
                    icons={false}
                    checked={targetPlan.duration === PlanDurations.ANNUALLY}
                    onChange={handlePlanDurationChange}
                    disabled={isLoadingUpcomingInvoice}
                  />
                  <span className="upcomingInvoice__switch-item upcomingInvoice__switch-text">
                    Annually
                  </span>
                </div>
                <div className="upcomingInvoice__discount">
                  Save {getAnnuallyDiscount(isApiPlan, targetPlan)}%
                </div>
              </div>
              <UpcomingInvoice
                targetPlan={targetPlan}
                sourcePlan={sourcePlan}
                couponId={appliedCouponId}
                onCouponAdd={onPromoAdd}
                onCouponClear={onPromoClear}
                onGetInvoice={setUpcomingInvoice}
                getUpcomingInvoice={handleGetUpcomingInvoice}
                isLoadingUpcomingInvoice={isLoadingUpcomingInvoice}
                isApiPlan={isApiPlan}
              />
              <div
                className={classNames('billing__plan-modal', 'buttons', {
                  left: sourcePlan.type !== PlanTypes.FREE,
                  mobile: isMobile,
                })}
              >
                <UIButton
                  isLoading={isLoading}
                  disabled={isLoading || isNewPlanSame}
                  className={classNames({ mobile: isMobile })}
                  priority="primary"
                  type="submit"
                  title="Subscribe"
                />
              </div>
            </form>
          )}
        />
        {upcomingInvoice && (
          <div className="billing__plan-modal footer">
            <div>
              Your subscription will be set to auto-renew for $
              {(upcomingInvoice.discountedAmount * upcomingInvoice.quantity).toFixed(2)}
              &nbsp;per&nbsp;
              {targetPlan.duration === PlanDurations.ANNUALLY ? 'year' : 'month'}. Your
              next payment is due on&nbsp;
              {new Date(
                trialEnd && !isExpired(trialEnd)
                  ? trialEnd
                  : upcomingInvoice.nextInvoiceDate,
              ).toDateString()}
              . You also agree to our
              <a
                href="https://signaturely.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              &nbsp;and
              <a
                href="https://signaturely.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </UIModal>
  );
};

export default PlanChangeModal;
