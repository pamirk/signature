import TrialGetWrapper from 'Layouts/TrialGetWrapper';
import React, { useCallback, useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { SecondStepInfo } from './components/SecondStepInfo';
import { Tabs } from './components/Tabs';
import { ReactSVG } from 'react-svg';
import AlertIcon from 'Assets/images/icons/alert-icon.svg';
import { HoverTooltip } from 'Components/HoverTooltip/HoverTooltip';
import dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
dayjs.extend(advancedFormat.default);

const TrialGetPage = ({ location }: RouteChildrenProps) => {
  const { isTrialUsed } = useSelector(selectUser);

  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  useEffect(() => {
    if (isTrialUsed) {
      return navigateToRoot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToRoot]);

  return (
    <TrialGetWrapper location={location}>
      <div className="sign-up-second-step">
        <div className="sign-up-second-step__tabs-wrapper">
          <Tabs activeTab={2} />
        </div>
        <p className="sign-up-second-step__title">
          Please add your payment details to{' '}
          <span className="sign-up-second-step__title-underline">
            start the free trial.
          </span>{' '}
          <br />
          You can cancel anytime before the free trial ends to avoid being billed.
          <span className={`dropDownMenu__alert header__help--stroke`}>
            <ReactSVG src={AlertIcon} className="header__help-icon" />
            <HoverTooltip>
              You won&apos;t be billed anything until the end of your trial period -{' '}
              <b>
                {dayjs(new Date())
                  .add(7, 'day')
                  .format('MMM Do')}
              </b>
              . You can cancel your subscription free of charge any time during the trial
              with just four simple clicks on your <b>billing details</b>.
            </HoverTooltip>
          </span>
        </p>
        <SecondStepInfo />
      </div>
    </TrialGetWrapper>
  );
};

export default TrialGetPage;
