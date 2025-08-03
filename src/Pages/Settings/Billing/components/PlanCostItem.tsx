import React from 'react';
import {
  PlanDurations,
  PlanTypes,
  defaultPlanPrices,
  discountPlanPrices,
} from 'Interfaces/Billing';
import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';
import { DiscountBillet } from '.';
import { isAvailablePlanForSale } from 'Utils/functions';

const targetByPlanType = {
  [PlanTypes.BUSINESS]: 'per user/month',
  [PlanTypes.PERSONAL]: '/month',
};

interface SalePlanCostItemProps {
  duration: PlanDurations;
  type: PlanTypes;
}

export const PlanCostItem = ({ duration, type }: SalePlanCostItemProps) => {
  const target = targetByPlanType[type];
  const defaultPrice = defaultPlanPrices[type][duration];
  const discountPrice = discountPlanPrices[type][duration];

  const isAvailablePlan = isAvailablePlanForSale(type, duration);

  return (
    <div>
      {(IS_BLACK_FRIDAY || IS_END_OF_YEAR) && isAvailablePlan ? (
        <div className="billing__planCost__container">
          <p className="billing__planCost--default">
            <s>{`$${defaultPrice}`}</s>
          </p>
          <p>
            now <b className="billing__planCost--current">{`$${discountPrice}`}</b>{' '}
            {target}
          </p>
          <DiscountBillet duration={duration} />
        </div>
      ) : (
        <p>{`$${defaultPrice} ${target}`}</p>
      )}
    </div>
  );
};

export default PlanCostItem;
