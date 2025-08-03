import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import { PlanTypes, SubscriptionInfo } from 'Interfaces/Billing';
import React from 'react';
import { isNotEmpty } from 'Utils/functions';

interface BillingPlanSliderProps {
  items: any[];
  userPlanPriority: number;
  planPriorityByDuration: any;
  openModal: (headerItem: any) => void;
  currentDisplayedPlan: PlanTypes;
  handleChangeCurrentPlan: (planType: PlanTypes) => void;
  isLoading?: boolean;
  subscriptionInfo: SubscriptionInfo;
  onRenewPlan: () => void;
}

const BillingPlansSlider = ({
  items,
  userPlanPriority,
  planPriorityByDuration,
  openModal,
  currentDisplayedPlan,
  handleChangeCurrentPlan,
  isLoading,
  subscriptionInfo,
  onRenewPlan,
}: BillingPlanSliderProps) => {
  return (
    <>
      <div className="billing__plans-slider-wrapper">
        <div className="billing__plans-slider">
          {items.map(headerItem => (
            <div
              key={headerItem.type}
              className={`billing__plans-slider-item${
                currentDisplayedPlan === PlanTypes.PERSONAL ? '-left' : ''
              }`}
            >
              <div className="billing__table-title">{headerItem.header}</div>
              <div className="billing__table--description">{headerItem.description}</div>
              {userPlanPriority ===
              planPriorityByDuration[headerItem.duration][headerItem.type] ? (
                isNotEmpty(subscriptionInfo) && !subscriptionInfo.neverExpires ? (
                  <div className="billing__current-plan renew" onClick={onRenewPlan}>
                    {isLoading ? <UISpinner /> : 'Renew'}
                  </div>
                ) : (
                  <div className="billing__current-plan">Current Plan</div>
                )
              ) : (
                <div className="billing__table-button">
                  <UIButton
                    title={`${
                      userPlanPriority >
                      planPriorityByDuration[headerItem.duration][headerItem.type]
                        ? 'Select'
                        : 'Upgrade'
                    }`}
                    handleClick={() => {
                      openModal(headerItem);
                    }}
                    priority="primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="billing__plans-slider-dots">
        {items.map(headerItem => (
          <>
            {currentDisplayedPlan === headerItem.type ? (
              <div
                onClick={() => handleChangeCurrentPlan(headerItem.type)}
                className="billing__plans-slider-dot--selected"
              />
            ) : (
              <div
                onClick={() => handleChangeCurrentPlan(headerItem.type)}
                className="billing__plans-slider-dot"
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default BillingPlansSlider;
