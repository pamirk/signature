import React, { useCallback, useMemo } from 'react';
import { LtdTier } from 'Interfaces/Billing';
import classNames from 'classnames';
import {
  LtdOptionNames,
  PlanFieldTypes,
  ltdOptions,
} from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import { ReactSVG } from 'react-svg';
import Check from 'Assets/images/icons/check.svg';

interface TierOptionsProps {
  ltdTier: LtdTier;
  selectedOptions?: LtdOptionNames[];
  isMobile?: boolean;
}

const TierOptions = ({ ltdTier, selectedOptions, isMobile }: TierOptionsProps) => {
  const ltdAdditionalOptions = useMemo(() => {
    const options = selectedOptions
      ? ltdOptions.filter(option => selectedOptions.includes(option.name))
      : ltdOptions;

    const info = options.map(item => {
      if (item.name === 'Users') {
        return {
          ...item,
          value: ltdTier.teammatesLimit === -1 ? 'Unlimited' : ltdTier.teammatesLimit,
        };
      }

      if (item.name === 'API Requests') {
        return {
          ...item,
          value: ltdTier.apiPlan.requestLimit,
        };
      }

      return item;
    });

    return info;
  }, [ltdTier.apiPlan.requestLimit, ltdTier.teammatesLimit, selectedOptions]);

  const getOptionValue = useCallback((option: any) => {
    switch (option.type) {
      case PlanFieldTypes.TEXT: {
        return <span className="option_value business">{option['value']}</span>;
      }
      case PlanFieldTypes.BOOLEAN:
        return (
          <span className="option_check business">
            <ReactSVG src={Check} />
          </span>
        );
    }
  }, []);

  return (
    <div className="plan-badge__options">
      <ul>
        {ltdAdditionalOptions.map(option => (
          <li
            className={classNames('plan-badge__options-item', {
              mobile: isMobile,
            })}
            key={option.name}
          >
            {`${option.name}:`}
            {getOptionValue(option)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TierOptions;
