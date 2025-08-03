import React, { useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { discountPlanPrices, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import dayjs from 'dayjs';
import { formatDateToStringForTrialInfo } from 'Utils/formatters';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { DataLayerAnalytics } from 'Services/Integrations';
import { User } from 'Interfaces/User';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import TrialGetWrapper from 'Layouts/TrialGetWrapper';
import { useLocation } from 'react-router-dom';
import { useShowTrialSuccessPageClear } from 'Hooks/Auth';

interface TrialSuccessProps {
  successRequired?: boolean;
}

function TrialSuccess() {
  const location = useLocation<TrialSuccessProps>();

  const [clearShowTrialSuccessPage] = useShowTrialSuccessPageClear();
  const { id }: User = useSelector(selectUser);

  if (!location?.state?.successRequired) History.push(AuthorizedRoutePaths.BASE_PATH);

  const price = discountPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
  const nextBillingDate = dayjs(new Date())
    .add(7, 'day')
    .format('MMMM D, YYYY');

  const handleLearnMore = () => {
    History.replace(AuthorizedRoutePaths.SETTINGS_BILLING);
  };

  const handleContinue = () => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  };

  useEffect(() => {
    DataLayerAnalytics.fireTrialSignUpEvent(id);
    clearShowTrialSuccessPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TrialGetWrapper location={location}>
      <div className="trialSuccess__inner">
        <div className="trialSuccess__wrapper">
          <p className="trialSuccess__header">
            Thank you for signing up for our 7-day free trial!
          </p>
          <p className="trialSuccess__text">
            We&apos;re excited to have you onboard. As a reminder, your trial will
            automatically transition to a full subscription for <b>${price}/month</b> on{' '}
            <b>{formatDateToStringForTrialInfo(nextBillingDate)}</b>. If you&apos;d like
            to continue enjoying our service without interruption, no action is needed. If
            you have any questions or would like to learn more about your subscription,
            we&apos;re here to help.
          </p>
          <UIButton
            priority="primary"
            title={'Learn More'}
            handleClick={handleLearnMore}
            className="trialSuccess__button--download"
          />
          <div className="trialSuccess__button--cancel" onClick={handleContinue}>
            Continue
          </div>
        </div>
      </div>
    </TrialGetWrapper>
  );
}

export default TrialSuccess;
