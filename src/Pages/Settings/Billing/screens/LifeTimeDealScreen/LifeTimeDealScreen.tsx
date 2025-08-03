import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import 'react-toggle/style.css';
import { useLtdTiersGet } from 'Hooks/Billing';
import { selectUser } from 'Utils/selectors';
import { LtdTier } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import {
  LtdOptionNames,
  LtdOptions,
  PlanFieldTypes,
  additionalLtdOptions,
  tierNumberById,
} from './planTableItems';

import UIButton from 'Components/UIComponents/UIButton';
import { LifeTimeDealSlider, LifeTimeDealTableMobileView } from '../../components';

import ArrowCircleIcon from 'Assets/images/icons/arrow-circle.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { isNotEmpty } from 'Utils/functions';
import UISpinner from 'Components/UIComponents/UISpinner';
import History from 'Services/History';
import classNames from 'classnames';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { planTypeToName } from 'Utils/formatters';

const renderCell = (
  type: PlanFieldTypes,
  value: JSX.Element | string | number | boolean,
) =>
  type === PlanFieldTypes.BOOLEAN && value ? (
    <ReactSVG src={ArrowCircleIcon} className="billing__table-icon" />
  ) : (
    value
  );

const LifeTimeDealScreen = () => {
  const user: User = useSelector(selectUser);

  const isMobile = useIsMobile();
  const [getLtdTiers, isGettingLtdTiers] = useLtdTiersGet();

  const [currentDisplayedTier, setCurrentDisplayedTier] = useState<LtdTier['id']>(
    user.ltdTierId,
  );
  const [tiers, setTiers] = useState<LtdTier[]>();

  const fullTiersOptions = useMemo(() => {
    return tiers?.map(tier => {
      const info = additionalLtdOptions.map(item => {
        if (item.name === LtdOptionNames.USERS) {
          return {
            ...item,
            value: tier.teammatesLimit === -1 ? 'Unlimited' : tier.teammatesLimit,
          };
        }

        if (item.name === LtdOptionNames.API_REQUESTS) {
          return {
            ...item,
            value: tier.apiPlan.requestLimit,
          };
        }

        if (item.name === LtdOptionNames.BULK_SEND_REQUESTS) {
          return {
            ...item,
            value: tier.bulkSendLimit,
          };
        }

        if (item.name === LtdOptionNames.FORMS) {
          return {
            ...item,
            value: tier.formsLimit,
          };
        }

        if (item.name === LtdOptionNames.PLAN) {
          return {
            ...item,
            value: planTypeToName[tier.planType],
          };
        }

        if (item.name === LtdOptionNames.PRICING) {
          return {
            ...item,
            value: `$${tier.price}`,
          };
        }

        return item;
      });

      return info as LtdOptions[];
    });
  }, [tiers]);

  const handleUpgradeTier = useCallback((newTierId: LtdTier['id']) => {
    History.push(`${AuthorizedRoutePaths.LTD_UPGRADE}`, {
      newTierId,
    });
  }, []);

  const handleGetLtdTiers = useCallback(async () => {
    const tiers = await getLtdTiers(undefined);

    if (isNotEmpty(tiers)) {
      setTiers(tiers);
    }
  }, [getLtdTiers]);

  useEffect(() => {
    handleGetLtdTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingLtdTiers || !tiers) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return (
    <div className="billing__plan-page">
      {!isMobile ? (
        <div className="billing__info-table">
          <div className="table">
            <div className="table__container billing">
              <div className="table__innerContainer billing">
                <div className="table__row billing__table-row billing__tier-table__header-container">
                  <div className="billing__table-column billing__table-column--header billing__tier-table__firstColumn" />
                  {tiers.map(tier => (
                    <div
                      key={tier.id}
                      className={classNames(
                        'billing__table-column',
                        'billing__table-column--header',
                        'billing__tier-table__column',
                        'billing__tier-table__column--header',
                      )}
                    >
                      <div className="billing__table-title">{tier.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              {additionalLtdOptions?.map((option, index) => (
                <div key={option.name} className="billing__table-row table__row">
                  <div className="billing__table-column billing__tier-table__firstColumn">
                    {option.name}
                  </div>
                  {fullTiersOptions?.map((item, itemIndex) => {
                    return (
                      <div
                        key={`${index}_${itemIndex}`}
                        className="billing__table-column billing__tier-table__column"
                      >
                        {renderCell(item[index].type, item[index].value)}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="billing__table-row table__row">
                <div className="billing__table-column billing__tier-table__firstColumn"></div>
                {tiers.map((tier, index) => {
                  return tierNumberById[tier.id] === tierNumberById[user.ltdTierId] ? (
                    <div
                      key={index}
                      className="billing__table-column billing__tier-table__column"
                    >
                      <div className="billing__current-plan">Current Plan</div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="billing__table-column billing__tier-table__column"
                    >
                      <div key={index} className="billing__table-button">
                        <UIButton
                          title={'Upgrade'}
                          handleClick={() => {
                            handleUpgradeTier(tier.id);
                          }}
                          priority="primary"
                          disabled={
                            tierNumberById[tier.id] < tierNumberById[user.ltdTierId]
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <LifeTimeDealSlider
            tiers={tiers}
            userTierPriority={tierNumberById[user.ltdTierId]}
            onSelectTierToUpgrade={handleUpgradeTier}
            currentDisplayedTier={currentDisplayedTier}
            handleChangeCurrentTier={tierId => setCurrentDisplayedTier(tierId)}
          />
          <div className="billing__info-table">
            <div className="table">
              <div className="table__container">
                <LifeTimeDealTableMobileView
                  fullTiersOptions={fullTiersOptions}
                  currentDisplayedTier={currentDisplayedTier}
                  renderCell={renderCell}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LifeTimeDealScreen;
