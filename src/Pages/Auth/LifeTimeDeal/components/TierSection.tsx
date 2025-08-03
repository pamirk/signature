import React from 'react';
import { LtdTier } from 'Interfaces/Billing';
import { planTypeToName } from 'Utils/formatters';
import classNames from 'classnames';
import TierOptions from './TierOptions';
import FeedbackBadge from './FeedbackBadge';

interface TierSectionProps {
  tier: LtdTier;
  children?: React.ReactNode;
  isMobile?: boolean;
}

const TierSection = ({ tier, children, isMobile }: TierSectionProps) => {
  return (
    <div
      className={classNames('lifeTimeDeal__content-right', {
        mobile: isMobile,
      })}
    >
      <div
        className={classNames('plan-badge business', {
          mobile: isMobile,
        })}
      >
        <div className="plan-badge__wrapper ">
          <div className="plan-badge__label">
            <div className="plan-badge__name">{planTypeToName[tier.planType]} Plan</div>
            <div className="plan-badge__price-wrapper">
              <div className="plan-badge__price">
                ${tier.price}
                &nbsp;
                <span>/Lifetime</span>
              </div>
              <div className="plan-badge__price__tier-billet">Tier {tier.tierNumber}</div>
            </div>
          </div>
          <div className="plan-badge__included-label">What&apos;s included?</div>
          <TierOptions ltdTier={tier} isMobile={isMobile} />
          {children}
        </div>
      </div>
      <FeedbackBadge />
    </div>
  );
};

export default TierSection;
