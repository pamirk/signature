import React from 'react';
import { ReactSVG } from 'react-svg';
import check from 'Assets/images/icons/check-v2.svg';
import {
  PlanDurations,
  PlanTypes,
  defaultPlanPrices,
  discountByDuration,
  discountPlanPrices,
} from 'Interfaces/Billing';
import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';
import { isAvailablePlanForSale } from 'Utils/functions';

const features = [
  'Unlimited signature requests',
  'Unlimited reusable templates',
  'Google Drive integration',
  'Dropbox integration',
  'One Drive integration',
  'Box integration',
  'Notifications and reminders',
  'Audit log and history',
  'Team management',
  'Custom business branding',
];

export const PlanSection = () => {
  const defaultPrice = defaultPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
  const discountPrice = discountPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
  const isSomeSale = IS_BLACK_FRIDAY || IS_END_OF_YEAR;

  const isAvailablePlan = isAvailablePlanForSale(
    PlanTypes.BUSINESS,
    PlanDurations.MONTHLY,
  );

  const discount = discountByDuration[PlanDurations.MONTHLY];

  return (
    <div className="sign-up-second-step__plan-section">
      <h3 className="sign-up-second-step__section-title">Your plan</h3>
      {isSomeSale && isAvailablePlan ? (
        <div className="sign-up-second-step__section-wrapper">
          <div className="sign-up-second-step__section-wrapper--main-info">
            <p className="sign-up-second-step__section sign-up-second-step__section__subtitle">
              7-day free trial, now <b>${`${discountPrice}`}/month</b>
            </p>
            <p className="billing__planCost--default">
              <s>{`$${defaultPrice},`}</s>
            </p>
          </div>
          <p className="sign-up-second-step__section sign-up-second-step__section__discount">{`${discount}% OFF`}</p>
        </div>
      ) : (
        <div className="sign-up-second-step__section-wrapper">
          <p className="sign-up-second-step__section sign-up-second-step__section__subtitle">
            7-day free trial, then ${defaultPrice}/month
          </p>
        </div>
      )}
      <h3 className="sign-up-second-step__section-ti  tle">All Features Included:</h3>
      <ul>
        {features.map(feature => (
          <li key={feature} className="sign-up-second-step__list-item">
            <span className="sign-up-second-step__check-icon">
              <ReactSVG src={check} />
            </span>{' '}
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
