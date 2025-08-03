import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import checkIcon from 'Assets/images/icons/check-in-circle.svg';
import unlockIcon from 'Assets/images/icons/unlock-icon.svg';
import bellIcon from 'Assets/images/icons/bell-icon.svg';
import starIcon from 'Assets/images/icons/star-icon-v2.svg';
import { HoverTooltip } from 'Components/HoverTooltip/HoverTooltip';
import AlertIcon from 'Assets/images/icons/alert-icon.svg';
import dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import {
  PlanDurations,
  PlanTypes,
  defaultPlanPrices,
  discountPlanPrices,
} from 'Interfaces/Billing';
import { isAvailablePlanForSale } from 'Utils/functions';
import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';
dayjs.extend(advancedFormat.default);

const defaultPrice = defaultPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
const discountPrice = discountPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
const isSomeSale = IS_BLACK_FRIDAY || IS_END_OF_YEAR;

const isAvailablePlan = isAvailablePlanForSale(PlanTypes.BUSINESS, PlanDurations.MONTHLY);

interface Step {
  title: string;
  description: string;
  icon: string;
  tooltipInfo?: ReactElement;
  tooltipPosition?: 'top' | 'bottom' | 'topRight';
}

const steps: Step[] = [
  {
    title: 'Create An Account',
    description: 'You successfully created your free account',
    icon: checkIcon,
  },
  {
    title: 'Today: Get instant access',
    description:
      'Sign documents by yourself or send for signature. Unlimited # of documents.',
    icon: unlockIcon,
  },
  {
    title: 'Day 4: free Trial reminder',
    description:
      "We'll send you an email/notification 3-days before billing. Cancel anytime",
    icon: bellIcon,
    tooltipInfo: (
      <p>
        You won&apos;t be billed anything until the end of your trial period -{' '}
        <b>
          {dayjs(new Date())
            .add(7, 'day')
            .format('MMM Do')}
        </b>
        . You can cancel your subscription free of charge any time during the trial with
        just four simple clicks on your <b>billing details</b>.
      </p>
    ),
    tooltipPosition: 'top',
  },
  {
    title: 'Day 7: free Trial ends',
    description: `You will be billed for the Business monthly plan ($${
      isSomeSale && isAvailablePlan ? discountPrice : defaultPrice
    }/mo) on ${dayjs(new Date())
      .add(7, 'day')
      .format('MMM DD')}`,
    icon: starIcon,
    tooltipInfo: (
      <p className="hoverTooltip--mirrorText">
        You can change your subscription plan any time during the trial on your{' '}
        <b>Subscription</b> section{' '}
      </p>
    ),
    tooltipPosition: 'topRight',
  },
];

interface StepProps {
  title: string;
  description: string;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  icon: string;
  tooltipInfo?: ReactElement;
  tooltipPosition?: 'top' | 'bottom' | 'topRight';
}

const Step = ({
  title,
  description,
  isLastStep,
  isFirstStep,
  icon,
  tooltipInfo,
  tooltipPosition,
}: StepProps) => {
  return (
    <div
      className={classNames('sign-up-second-step__step-wrapper', {
        'sign-up-second-step__step-wrapper--active': isFirstStep,
      })}
    >
      <div
        className={classNames('sign-up-second-step__step-icon-wrapper', {
          'sign-up-second-step__step-icon-wrapper--lastStep': isLastStep,
          'sign-up-second-step__step-icon-wrapper--active': isFirstStep,
        })}
      >
        <ReactSVG src={icon} />
      </div>
      <div className="sign-up-second-step__step-text-wrapper">
        <h3
          className={classNames('sign-up-second-step__step-title', {
            'sign-up-second-step__step-title--first': isFirstStep,
          })}
        >
          {title}
        </h3>
        <p className="sign-up-second-step__step-description">
          {description}
          {tooltipInfo && (
            <span className={`dropDownMenu__alert header__help--stroke`}>
              <ReactSVG src={AlertIcon} className="header__help-icon" />
              <HoverTooltip position={tooltipPosition}>{tooltipInfo}</HoverTooltip>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export const TrialInfo = () => {
  return (
    <div className="sign-up-second-step__plan-section sign-up-second-step__trial-section">
      <h3 className="sign-up-second-step__section-title n">
        How your free{' '}
        <span className="sign-up-second-step__title-underline">trial works</span>{' '}
      </h3>
      {steps.map((step, index) => (
        <Step
          key={index}
          title={step.title}
          description={step.description}
          icon={step.icon}
          isLastStep={index === steps.length - 1}
          isFirstStep={index === 0}
          tooltipInfo={step.tooltipInfo}
          tooltipPosition={step.tooltipPosition}
        />
      ))}
    </div>
  );
};
