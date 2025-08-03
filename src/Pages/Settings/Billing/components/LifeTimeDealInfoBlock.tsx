import React, { useCallback, useEffect, useMemo } from 'react';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { LtdTier } from 'Interfaces/Billing';
import History from 'Services/History';
import UIButton from 'Components/UIComponents/UIButton';
import classNames from 'classnames';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { useLtdTierGet } from 'Hooks/Billing';
import UISpinner from 'Components/UIComponents/UISpinner';
import {
  LtdTiersIds,
  shortLtdOptions,
} from '../screens/LifeTimeDealScreen/planTableItems';
import { planTypeToName } from 'Utils/formatters';
import { useSelector } from 'react-redux';
import { selectLtdTier } from 'Utils/selectors';
import { isNotEmpty } from 'Utils/functions';

interface LifeTimeDealInfoBlockProps {
  ltdId: LtdTier['id'];
}

const LifeTimeDealInfoBlock = ({ ltdId }: LifeTimeDealInfoBlockProps) => {
  const isMobile = useIsMobile();
  const [getLtdTier, isGettingLtdTier] = useLtdTierGet();
  const currentLtd = useSelector(selectLtdTier);
  const isDisabledForUpgrade = currentLtd.id === LtdTiersIds.B_TIER_5;

  const shortLtdAdditionalOptions = useMemo(() => {
    const info = shortLtdOptions.map(item => {
      if (item.name === 'Users') {
        return {
          ...item,
          value:
            currentLtd.teammatesLimit === -1 ? 'Unlimited' : currentLtd.teammatesLimit,
        };
      }

      return item;
    });

    return info;
  }, [currentLtd]);

  const handleUpgradeClick = useCallback(() => {
    History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
  }, []);

  const handleGetLtdTier = useCallback(async () => {
    await getLtdTier({ ltdId });
  }, [getLtdTier, ltdId]);

  useEffect(() => {
    handleGetLtdTier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingLtdTier || !isNotEmpty(currentLtd)) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={50}
        height={50}
      />
    );
  }

  return (
    <div className={classNames('billing__tier-wrapper', { mobile: isMobile })}>
      <span className="billing__tier-label">
        Signaturely + Prime Deals Lifetime Plans
      </span>
      <div className={classNames('billing__tier-container', { mobile: isMobile })}>
        <div className={classNames('billing__tier-left', { mobile: isMobile })}>
          <div className="billing__tier-left__title-container">
            <span className="billing__tier-left__title-container__title">
              {currentLtd.name}
            </span>
            <div className="billing__tier-left__title-container__plan-billet billing__current-plan">
              Current Plan
            </div>
          </div>
          <div className="billing__tier-left__plan-container">
            <span className="billing__tier-left__plan-container__plan-name">
              {planTypeToName[currentLtd.planType]} Plan <b>(${currentLtd.price})</b>
            </span>
          </div>
          <UIButton
            priority="primary"
            className="billing__tier-left__plan-container__button"
            title={'Upgrade'}
            handleClick={handleUpgradeClick}
            disabled={isDisabledForUpgrade}
          />
        </div>
        <div className={classNames('billing__tier-right', { mobile: isMobile })}>
          <div className="billing__tier-right__title">What&apos; included?</div>
          <ul>
            {shortLtdAdditionalOptions.map(option => (
              <li className="billing__tier-right__options-item" key={option.name}>
                <span className="option_value business">
                  {option['value']} {option['name']}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LifeTimeDealInfoBlock;
