import { AppSumoStatus } from 'Interfaces/Billing';
import React from 'react';
import { PlanFieldTypes } from './planTableItems';

export interface AppSumoTableMobileViewProps {
  planInformationItems: any[];
  currentDisplayedStatus: AppSumoStatus;
  renderCell: (
    type: PlanFieldTypes,
    value: string | boolean,
  ) => string | boolean | JSX.Element;
}

const AppSumoTableMobileView = ({
  planInformationItems,
  currentDisplayedStatus,
  renderCell,
}: AppSumoTableMobileViewProps) => {
  const getCurrentPlanItemValue = (item: any) => {
    switch (currentDisplayedStatus) {
      case AppSumoStatus.STANDARD:
        return (
          <div className="billing__table-column billing__table-column">
            {renderCell(item.type, item.oneCodeValue)}
          </div>
        );
      case AppSumoStatus.FULL:
        return (
          <div className="billing__table-column billing__table-column">
            {renderCell(item.type, item.twoCodeValue)}
          </div>
        );
    }
  };

  return (
    <div className="table">
      <div className="table__container">
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
      </div>
    </div>
  );
};

export default AppSumoTableMobileView;
