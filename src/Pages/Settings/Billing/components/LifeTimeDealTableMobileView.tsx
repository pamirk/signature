import { LtdTier } from 'Interfaces/Billing';
import React from 'react';
import {
  LtdOptions,
  PlanFieldTypes,
  tierNumberById,
} from '../screens/LifeTimeDealScreen/planTableItems';

interface LifeTimeDealTableMobileViewProps {
  fullTiersOptions?: LtdOptions[][];
  currentDisplayedTier: LtdTier['id'];
  renderCell: (
    type: PlanFieldTypes,
    value: string | number | boolean,
  ) => string | number | boolean | JSX.Element;
}

const LifeTimeDealTableMobileView = ({
  fullTiersOptions,
  currentDisplayedTier,
  renderCell,
}: LifeTimeDealTableMobileViewProps) => {
  if (!fullTiersOptions) return null;

  return (
    <>
      <div className="billing__plan-info table__row billing__table-row--borderless settings__text settings__text--bold settings__text--default-size">
        Tier Information
      </div>
      {fullTiersOptions[tierNumberById[currentDisplayedTier] - 1].map(option => (
        <div key={option.name} className="billing__table-row table__row">
          <div className="billing__table-column mobile billing__table-column--name">
            {option.name}
          </div>
          <div className="billing__table-column mobile">
            {renderCell(option.type, option.value)}
          </div>
        </div>
      ))}
    </>
  );
};

export default LifeTimeDealTableMobileView;
