import { PlanTypes } from 'Interfaces/Billing';
import React from 'react';
import { PlanFieldTypes } from './planTableItems';

interface BillingPlanTableMobileViewProps {
  planInformationItems: any;
  currentDisplayedPlan: PlanTypes;
  renderCell: (
    type: PlanFieldTypes,
    value: string | boolean,
  ) => string | boolean | JSX.Element;
}

const BillingPlanTableMobileView = ({
  planInformationItems,
  currentDisplayedPlan,
  renderCell,
}: BillingPlanTableMobileViewProps) => {
  const getCurrentPlanItemValue = (item: any) => {
    switch (currentDisplayedPlan) {
      case PlanTypes.FREE:
        return (
          <div className="billing__table-column billing__table-column">
            {renderCell(item.type, item.freeValue)}
          </div>
        );
      case PlanTypes.PERSONAL:
        return (
          <div className="billing__table-column billing__table-column">
            {renderCell(item.type, item.personalValue)}
          </div>
        );
      case PlanTypes.BUSINESS:
        return (
          <div className="billing__table-column billing__table-column">
            {renderCell(item.type, item.businessValue)}
          </div>
        );
    }
  };

  return (
    <>
      <div className="billing__plan-info table__row billing__table-row--borderless settings__text settings__text--bold settings__text--default-size">
        Plan Information
      </div>
      {planInformationItems.map(item => (
        <div key={item.name} className="billing__table-row table__row">
          <div className="billing__table-column billing__table-column--name">
            {item.name}
          </div>
          {getCurrentPlanItemValue(item)}
        </div>
      ))}
    </>
  );
};

export default BillingPlanTableMobileView;
