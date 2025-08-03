import React, { useState, useCallback } from 'react';
import { capitalize } from 'lodash';
import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import {
  LtdStandardDiscount,
  CardFormValues,
  CreateSubscriptionCheckoutPayload,
  Plan,
  PlanDurations,
  PlanTypes,
  UpcomingInvoiceTypes,
  defaultPlanPrices,
} from 'Interfaces/Billing';
import { useLtdUpcomingInvoiceGet, useCardAttach, useCreateCard } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import UIModal from 'Components/UIComponents/UIModal';
import classNames from 'classnames';
import { Form } from 'react-final-form';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { UpcomingInvoice } from 'Pages/Settings/Billing/screens/BillingDefaultPlanScreen';
import UIButton from 'Components/UIComponents/UIButton';
import Toggler from 'react-toggle';

export interface PlanChangeModalProps extends BaseModalProps {
  targetPlan: Plan;
  sourcePlan: Plan;
  cardInitialValues: CardFormValues | undefined;
  appliedCouponId?: string;
  isLoading?: boolean;
  onChangePlan: () => void;
  onSelectedDurationChange: (duration: PlanDurations) => void;
  isUpgradingPlan?: boolean;
}

const renderChangeModalText = (targetPlan: Plan, sourcePlan: Plan) => {
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
    const priceMonth = defaultPlanPrices[targetPlan.type][PlanDurations.MONTHLY];
    const discountedPriceMonth = priceMonth * (1 - LtdStandardDiscount / 100);
    const discountedPriceYear = discountedPriceMonth * 12;
    return (
      <span style={{ color: '#7D8D98' }}>
        Instead of paying ${priceMonth}/month, you would pay only&nbsp;
        <span style={{ fontWeight: 'bold', color: '#000' }}>
          ${discountedPriceMonth.toFixed(2)}
          /month billed yearly (${discountedPriceYear})
        </span>
        .
      </span>
    );
  }
};

const LtdPlanChangeModal = ({
  targetPlan,
  sourcePlan,
  cardInitialValues,
  appliedCouponId,
  isLoading,
  onChangePlan,
  onSelectedDurationChange,
  onClose,
  isUpgradingPlan = false,
}: PlanChangeModalProps) => {
  const createCard = useCreateCard();
  const [attachCard] = useCardAttach();
  const isMobile = useIsMobile();
  const [getLtdUpcomingInvoice, isLoadingLtdUpcomingInvoice] = useLtdUpcomingInvoiceGet();
  const [upcomingInvoice, setUpcomingInvoice] = useState<UpcomingInvoiceTypes>();

  const handleChangePlan = useCallback(
    async (values: CardFormValues) => {
      try {
        if (!cardInitialValues) {
          const token = await createCard(values);
          token && (await attachCard(token));
        }

        onChangePlan();
        onClose();
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [attachCard, cardInitialValues, createCard, onChangePlan, onClose],
  );

  const handlePlanDurationChange = event => {
    const duration = event.target.checked
      ? PlanDurations.ANNUALLY
      : PlanDurations.MONTHLY;

    onSelectedDurationChange(duration);
  };

  const handleGetLtdUpcomingInvoice = useCallback(
    async (values: CreateSubscriptionCheckoutPayload) => {
      return getLtdUpcomingInvoice(values);
    },
    [getLtdUpcomingInvoice],
  );

  return (
    <UIModal onClose={onClose} className="changePlanModal">
      <div className={classNames('billing__plan-modal', { mobile: isMobile })}>
        <Form
          onSubmit={handleChangePlan}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="card-form">
              <div className="billing__plan-modal-title">Upgrade your plan</div>
              <div className="billing__plan-modal-subtitle">
                {renderChangeModalText(targetPlan, sourcePlan)}
              </div>
              <div className="upcomingInvoice__switch-container">
                <div className="upcomingInvoice__switch">
                  <span className="upcomingInvoice__switch-item upcomingInvoice__switch-text">
                    Monthly
                  </span>
                  <Toggler
                    className="upcomingInvoice__switch-item upcomingInvoice__switch-toggler"
                    icons={false}
                    checked={
                      isUpgradingPlan || targetPlan.duration === PlanDurations.ANNUALLY
                    }
                    onChange={handlePlanDurationChange}
                    disabled={isUpgradingPlan}
                  />
                  <span className="upcomingInvoice__switch-item upcomingInvoice__switch-text">
                    Annually
                  </span>
                </div>
                <div className="upcomingInvoice__discount">
                  Save {LtdStandardDiscount}%
                </div>
              </div>
              <UpcomingInvoice
                targetPlan={targetPlan}
                sourcePlan={sourcePlan}
                couponId={appliedCouponId}
                onGetInvoice={setUpcomingInvoice}
                getUpcomingInvoice={handleGetLtdUpcomingInvoice}
                isLoadingUpcomingInvoice={isLoadingLtdUpcomingInvoice}
              />
              <div
                className={classNames(
                  'billing__plan-modal buttons',
                  `${sourcePlan.type !== PlanTypes.FREE ? 'left' : ''}${
                    isMobile ? ' mobile' : ''
                  }`,
                )}
              >
                <UIButton
                  isLoading={isLoading}
                  disabled={isLoading}
                  className={isMobile ? ' mobile' : ''}
                  priority="primary"
                  type="submit"
                  title={isUpgradingPlan ? 'Subscribe' : 'Send Invites'}
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
              {new Date(upcomingInvoice.nextInvoiceDate).toDateString()}. You also agree
              to our
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

export default LtdPlanChangeModal;
