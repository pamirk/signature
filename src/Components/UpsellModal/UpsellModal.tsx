import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import PresentIcon from 'Assets/images/icons/present.svg';
import {
  AnnuallyDiscount,
  ApiPlan,
  ApiPlanTypes,
  DefaultUpsellDiscount,
  Plan,
  PlanDurations,
  PlanTypes,
  defaultPlanPrices,
} from 'Interfaces/Billing';
import { isAvailablePlanForSale } from 'Utils/functions';
import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';
import { apiPlanPrices } from 'Components/ApiPlansSection/constants';

export interface ConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
  plan: Plan | ApiPlan;
  isLoading?: boolean;
}

const UpsellModal = ({ onConfirm, onClose, plan, isLoading }: ConfirmModalProps) => {
  const isApiPlan = Object.values(ApiPlanTypes).includes(plan.type as ApiPlanTypes);
  const handleConfirm = useCallback(async () => {
    await onConfirm();
    onClose();
  }, [onClose, onConfirm]);

  const price = isApiPlan
    ? apiPlanPrices[plan.type][PlanDurations.MONTHLY]
    : defaultPlanPrices[plan.type][PlanDurations.MONTHLY];

  const UpsellDiscount =
    (IS_END_OF_YEAR || IS_BLACK_FRIDAY) &&
    isAvailablePlanForSale(plan.type as PlanTypes, plan.duration)
      ? AnnuallyDiscount
      : DefaultUpsellDiscount;

  const monthlyUpsellPrice = price * (1 - UpsellDiscount / 100);
  const annuallyUpsellPrice = monthlyUpsellPrice * 12;

  return (
    <UIModal onClose={onClose}>
      <div className="upsellModal">
        <div className="upsellModal__icon-container">
          <div className="upsellModal__icon">
            <ReactSVG src={PresentIcon} />
          </div>
        </div>
        <div className="upsellModal__title">WAIT! Special one-time offer</div>
        <div className="upsellModal__content">
          <p>
            To thank you for choosing Signaturely, we would like to
            <br />
            offer you{' '}
            <span className="black-text">{UpsellDiscount}% off for paying annually.</span>
          </p>
          <p>
            Instead of paying ${price}/month, you would pay only
            <br />
            <span className="black-text">
              ${monthlyUpsellPrice}/month billed annually ($
              {annuallyUpsellPrice}).
            </span>
          </p>
        </div>
        <div className="upsellModal__buttons">
          <UIButton
            priority="primary"
            handleClick={handleConfirm}
            title="Yes, upgrade me!"
            isLoading={isLoading}
            disabled={isLoading}
          />
          <div className="upsellModal__button-cancel" onClick={onClose}>
            No thanks
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default UpsellModal;
