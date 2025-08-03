import React from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import {
  ApiPlanItem,
  ApiPlanTypes,
  PlanDurations,
  PlanDurationAcronims,
} from 'Interfaces/Billing';
import ArrowCircleIcon from 'Assets/images/icons/arrow-circle.svg';

interface ApiPlanCardProps {
  item: ApiPlanItem;
  onUpgrade: (type: ApiPlanTypes, duration: PlanDurations) => void;
  buttonText: string;
  templatesUsed?: number;
  requestsUsed?: number;
  testRequestsMonthlyUsed?: number;
  isCurrent?: boolean;
  presentRequestUsage: boolean;
  presentTestRequestUsage: boolean;
  presentTemplateUsage: boolean;
  isLoading?: boolean;
  handleRenew: () => void;
  isRecuringStoped?: boolean;
  isTitaniumCustom?: boolean;
}

const ApiPlanCard = ({
  item: { content, duration, title, price, type },
  requestsUsed,
  testRequestsMonthlyUsed,
  templatesUsed,
  buttonText,
  isCurrent,
  presentRequestUsage = true,
  presentTestRequestUsage = true,
  presentTemplateUsage = true,
  onUpgrade,
  isLoading,
  handleRenew,
  isRecuringStoped,
  isTitaniumCustom,
}: ApiPlanCardProps) => {
  return (
    <div className="api-plan">
      <div className="api-plan__wrapper">
        <div className="api-plan__header">
          <div className="api-plan__title">{title}</div>
          <div className="api-plan__price">
            <span className="api-plan__price-number">{price}</span>
            <span className="api-plan__price-duration">
              /{PlanDurationAcronims[duration]}
            </span>
          </div>
        </div>
        <div className="api-plan__content-section">
          {content.map((contentItem, index) => (
            <div key={index} className="api-plan__content-row">
              <ReactSVG src={ArrowCircleIcon} className="api-plan__content-icon" />
              {contentItem}
            </div>
          ))}
        </div>
        <div className="api-plan__button-wrapper">
          {isCurrent ? (
            <>
              {isRecuringStoped ? (
                <div
                  className="billing__current-plan api-plan__current-plan renew"
                  onClick={handleRenew}
                >
                  Renew
                </div>
              ) : (
                <div className="billing__current-plan api-plan__current-plan">
                  Current plan
                </div>
              )}
            </>
          ) : (
            <UIButton
              priority="primary"
              title={buttonText}
              className="api-plan__upgrade-button"
              handleClick={() => onUpgrade(type, duration)}
              disabled={isLoading || isTitaniumCustom}
              isLoading={isLoading}
            />
          )}
        </div>
        {presentRequestUsage && (
          <div className="api-plan__usage-info">
            <span className="api-plan__usage-count">{requestsUsed}</span>
            <span className="api-plan__usage-text">
              &nbsp;API Signature Request left this month
            </span>
          </div>
        )}
        {presentTestRequestUsage && (
          <div className="api-plan__usage-info">
            <span className="api-plan__usage-count">{testRequestsMonthlyUsed}</span>
            <span className="api-plan__usage-text">
              &nbsp;Test API Signature Request left this month
            </span>
          </div>
        )}
        {presentTemplateUsage && (
          <div className="api-plan__usage-info">
            <span className="api-plan__usage-count">{templatesUsed}</span>
            <span className="api-plan__usage-text">&nbsp;Templates used</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiPlanCard;
