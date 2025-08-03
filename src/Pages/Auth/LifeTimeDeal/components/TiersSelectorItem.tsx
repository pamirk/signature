import React from 'react';
import { LtdTier } from 'Interfaces/Billing';
import { planTypeToName } from 'Utils/formatters';
import TierOptions from './TierOptions';
import {
  LtdOptionNames,
  popularTiers,
} from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import classNames from 'classnames';

interface TiersSelectorItemProps {
  tier: LtdTier;
  onClick: (tier: LtdTier) => void;
  isActive?: boolean;
}

const TiersSelectorItem = ({
  tier,
  onClick,
  isActive = false,
}: TiersSelectorItemProps) => {
  const isPopularTier = popularTiers.includes(tier.id);

  return (
    <div className="lifeTimeDeal__content-right selector" onClick={() => onClick(tier)}>
      <div
        className={classNames('plan-badge select', {
          active: isActive,
          inactive: !isActive,
          popular: !isActive && isPopularTier,
        })}
      >
        {isPopularTier && <div className="plan-badge__best-value">BEST VALUE</div>}
        <div className="plan-badge__wrapper select-item">
          <div className="plan-badge__label">
            <div className="plan-badge__name">{planTypeToName[tier.planType]} Plan</div>
            <div className="plan-badge__price">
              ${tier.price}
              &nbsp;
              <span>/Lifetime</span>
            </div>
            <div className="plan-badge__price__tier-billet">Tier {tier.tierNumber}</div>
          </div>
          <TierOptions
            ltdTier={tier}
            selectedOptions={[
              LtdOptionNames.USERS,
              LtdOptionNames.API_REQUESTS,
              LtdOptionNames.SIGNATURE_REQUESTS,
              LtdOptionNames.TEMPLATES,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default TiersSelectorItem;
