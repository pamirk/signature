import UIButton from 'Components/UIComponents/UIButton';
import { LtdTier } from 'Interfaces/Billing';
import React from 'react';
import { tierNumberById } from '../screens/LifeTimeDealScreen/planTableItems';

interface LifeTimeDealSliderProps {
  tiers: LtdTier[];
  userTierPriority: number;
  onSelectTierToUpgrade: (newTierId: LtdTier['id']) => void;
  currentDisplayedTier: LtdTier['id'];
  handleChangeCurrentTier: (tierId: LtdTier['id']) => void;
}

const LifeTimeDealSlider = ({
  tiers,
  userTierPriority,
  onSelectTierToUpgrade,
  currentDisplayedTier,
  handleChangeCurrentTier,
}: LifeTimeDealSliderProps) => {
  return (
    <>
      <div className="billing__plans-slider-wrapper">
        <div className="billing__plans-slider">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`billing__tier-slider-item tier${tierNumberById[currentDisplayedTier]}`}
            >
              <div className="billing__table-title">{tier.name}</div>
              <div className="billing__table-button">
                {tierNumberById[tier.id] === userTierPriority ? (
                  <div className="billing__current-plan">Current Plan</div>
                ) : (
                  <UIButton
                    title={'Upgrade'}
                    handleClick={() => {
                      onSelectTierToUpgrade(tier.id);
                    }}
                    priority="primary"
                    disabled={tierNumberById[tier.id] < userTierPriority}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="billing__plans-slider-dots">
        {tiers.map(tier => (
          <div key={tier.id}>
            {currentDisplayedTier === tier.id ? (
              <div
                onClick={() => handleChangeCurrentTier(tier.id)}
                className="billing__plans-slider-dot--selected"
              />
            ) : (
              <div
                onClick={() => handleChangeCurrentTier(tier.id)}
                className="billing__plans-slider-dot"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default LifeTimeDealSlider;
