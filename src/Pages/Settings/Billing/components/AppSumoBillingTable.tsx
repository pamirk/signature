import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import 'react-toggle/style.css';
import { selectUser } from 'Utils/selectors';
import { AppSumoStatus } from 'Interfaces/Billing';
import { planInformationItems, PlanFieldTypes } from './planTableItems';
import ArrowCircleIcon from 'Assets/images/icons/arrow-circle.svg';
import { User } from 'Interfaces/User';
import { CodeInput } from './';
import { useAppSumoUpgrade } from 'Hooks/Billing';
import Toast from 'Services/Toast';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import AppSumoBillingSlider from './modals/AppSumoBillingSlider';
import AppSumoTableMobileView from './AppSumoTableMobileView';

const renderCell = (type: PlanFieldTypes, value: string | boolean) =>
  type === PlanFieldTypes.BOOLEAN && value ? (
    <ReactSVG src={ArrowCircleIcon} className="billing__table-icon" />
  ) : (
    value
  );

interface AppSumoBillingTableProps {
  isAlignLeftTitle?: boolean;
}

const AppSumoBillingTable = ({ isAlignLeftTitle }: AppSumoBillingTableProps) => {
  const isMobile = useIsMobile();
  const { appSumoStatus }: User = useSelector(selectUser);
  const [currentDisplayedStatus, setCurrentDisplayedStatus] = useState<AppSumoStatus>(
    AppSumoStatus.STANDARD,
  );
  const [upgradeAppSumo, isUpgradeLoading] = useAppSumoUpgrade();

  const handleAppSumoUpgrade = useCallback(
    async (code: string) => {
      try {
        await upgradeAppSumo({ code });
        Toast.success('You account has been upgraded successfully');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [upgradeAppSumo],
  );

  return (
    <div className="billing__info-table">
      <div
        className={classNames(
          'billing__switch-container',
          isAlignLeftTitle ? 'left' : '',
        )}
      >
        <div className="billing__appSumo-title">Signaturely + AppSumo Lifetime Plans</div>
      </div>
      {!isMobile ? (
        <div className="table">
          <div className="table__container">
            <div className="table__innerContainer">
              <div className="table__row billing__table-row">
                <div className="billing__table-column billing__table-column--header billing__table-column--name"></div>
                <div className="billing__table-column billing__table-column--header">
                  <div>
                    <div className="billing__table-title">1 Code</div>
                    <div className="billing__table--description">
                      Business Plan&nbsp;
                      <span className="billing__appSumo--bold">(59$)</span>
                    </div>
                    {appSumoStatus === AppSumoStatus.STANDARD && (
                      <div className="billing__current-plan">Current Plan</div>
                    )}
                  </div>
                </div>
                <div className="billing__table-column billing__table-column--header">
                  <div className="billing__headerContainer">
                    <div className="billing__table-title">2 Code</div>
                    <div className="billing__table--description">
                      Unlimited Business Plan&nbsp;
                      <span className="billing__appSumo--bold">(118$)</span>
                    </div>
                    {appSumoStatus === AppSumoStatus.FULL ? (
                      <div className="billing__current-plan">Current Plan</div>
                    ) : (
                      <CodeInput
                        onUpgrade={handleAppSumoUpgrade}
                        isLoading={isUpgradeLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="billing__plan-info table__row billing__table-row--borderless settings__text settings__text--bold settings__text--default-size">
              Plan Information
            </div>
            {planInformationItems.map(item => (
              <div key={item.name} className="billing__table-row table__row">
                <div className="billing__table-column billing__table-column--name">
                  {item.name}
                </div>
                <div className="billing__table-column billing__table-column">
                  {renderCell(item.type, item.oneCodeValue)}
                </div>
                <div className="billing__table-column billing__table-column">
                  {renderCell(item.type, item.twoCodeValue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <AppSumoBillingSlider
            userAppSumoStatus={appSumoStatus}
            currentDisplayedAppSumoStatus={currentDisplayedStatus}
            handleChangeCurrentDisplayedStatus={status =>
              setCurrentDisplayedStatus(status)
            }
            handleAppSumoUpgrade={handleAppSumoUpgrade}
            isUpgradeLoading={isUpgradeLoading}
          />
          <AppSumoTableMobileView
            planInformationItems={planInformationItems}
            currentDisplayedStatus={currentDisplayedStatus}
            renderCell={renderCell}
          />
        </>
      )}
    </div>
  );
};

export default AppSumoBillingTable;
