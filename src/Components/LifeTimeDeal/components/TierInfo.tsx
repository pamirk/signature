import React from 'react';
import classNames from 'classnames';
import { LtdTier } from 'Interfaces/Billing';
import { planTypeToName } from 'Utils/formatters';

interface TierInfoProps {
  tier: LtdTier;
  billetText?: string;
  wrapperClassName?: string;
  billetClassName?: string;
  needPricing?: boolean;
  disabled?: boolean;
}

const TierInfo = ({
  tier,
  billetText,
  wrapperClassName,
  billetClassName,
  needPricing = false,
  disabled = false,
}: TierInfoProps) => {
  return (
    <div className={classNames('redeemCodeModal__tierInfo-wrapper', wrapperClassName)}>
      <div className="redeemCodeModal__tierInfo-container">
        <div className="redeemCodeModal__tierInfo-header__container">
          <p className="redeemCodeModal__tierInfo-header__title">{tier.name}</p>
          <div
            className={classNames(
              'redeemCodeModal__tierInfo-header__price',
              billetClassName,
            )}
          >
            {billetText ? billetText : `$${tier.price}`}
          </div>
        </div>
        <div className="redeemCodeModal__tierInfo-info__wrapper">
          <div className="redeemCodeModal__tierInfo-info__container">
            <p className="redeemCodeModal__tierInfo-info__item-name">Plan</p>
            <p
              className={classNames('redeemCodeModal__tierInfo-info__item-value', {
                disabled,
              })}
            >
              {planTypeToName[tier.planType]}
            </p>
          </div>
          <div className="redeemCodeModal__tierInfo-info__container">
            <p className="redeemCodeModal__tierInfo-info__item-name">Users</p>
            <p
              className={classNames('redeemCodeModal__tierInfo-info__item-value', {
                disabled,
              })}
            >
              {tier.teammatesLimit === -1 ? 'Unlimited' : tier.teammatesLimit}
            </p>
          </div>
          <div className="redeemCodeModal__tierInfo-info__container">
            <p className="redeemCodeModal__tierInfo-info__item-name">API Requests</p>
            <p
              className={classNames('redeemCodeModal__tierInfo-info__item-value', {
                disabled,
              })}
            >
              {tier.apiPlan.requestLimit}
            </p>
          </div>
          {needPricing && (
            <div className="redeemCodeModal__tierInfo-info__container">
              <p className="redeemCodeModal__tierInfo-info__item-name">Pricing</p>
              <p
                className={classNames('redeemCodeModal__tierInfo-info__item-value', {
                  disabled,
                })}
              >
                ${tier.price}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TierInfo;
