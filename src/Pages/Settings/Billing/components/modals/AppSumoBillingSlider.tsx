import { AppSumoStatus } from 'Interfaces/Billing';
import React from 'react';
import CodeInput from '../CodeInput';

interface AppSumoBillingSliderProps {
  userAppSumoStatus: AppSumoStatus;
  currentDisplayedAppSumoStatus: AppSumoStatus;
  handleChangeCurrentDisplayedStatus: (status: AppSumoStatus) => void;
  handleAppSumoUpgrade: (code: string) => void;
  isUpgradeLoading: boolean;
}

const AppSumoBillingSlider = ({
  userAppSumoStatus,
  currentDisplayedAppSumoStatus,
  handleChangeCurrentDisplayedStatus,
  handleAppSumoUpgrade,
  isUpgradeLoading,
}: AppSumoBillingSliderProps) => {
  return (
    <>
      <div className="billing__appSumo-slider_wrapper">
        <div className="billing__appSumo-slider">
          <div
            className={`billing__appSumo-slider-item${
              currentDisplayedAppSumoStatus === AppSumoStatus.STANDARD
                ? '--left'
                : '--right'
            }`}
          >
            <div className="billing__table-column billing__table-column--header">
              <div className="billing__table-title">1 Code</div>
              <div className="billing__table--description">
                Business Plan&nbsp;
                <span className="billing__appSumo--bold">(59$)</span>
              </div>
              {userAppSumoStatus === AppSumoStatus.STANDARD && (
                <div className="billing__current-plan">Current Plan</div>
              )}
            </div>
          </div>
          <div
            className={`billing__appSumo-slider-item${
              currentDisplayedAppSumoStatus === AppSumoStatus.FULL ? '--right' : '--left'
            }`}
          >
            <div className="billing__table-column billing__table-column--header">
              <div className="billing__table-title">2 Code</div>
              <div className="billing__table--description">
                Unlimited Business Plan&nbsp;
                <span className="billing__appSumo--bold">(118$)</span>
              </div>
              {userAppSumoStatus === AppSumoStatus.FULL ? (
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
      <div className="billing__appSumo-slider-dots">
        <div
          className={`billing__appSumo-slider-dot${
            currentDisplayedAppSumoStatus === AppSumoStatus.STANDARD ? '--selected' : ''
          }`}
          onClick={() => handleChangeCurrentDisplayedStatus(AppSumoStatus.STANDARD)}
        />
        <div
          className={`billing__appSumo-slider-dot${
            currentDisplayedAppSumoStatus === AppSumoStatus.FULL ? '--selected' : ''
          }`}
          onClick={() => handleChangeCurrentDisplayedStatus(AppSumoStatus.FULL)}
        />
      </div>
    </>
  );
};

export default AppSumoBillingSlider;
