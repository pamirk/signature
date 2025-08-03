import React, { useEffect, useMemo } from 'react';
import { Location } from 'history';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import Logo from 'Assets/images/logo.svg';
import { useLogout } from 'Hooks/Auth';
import DropDownUser from '../DropDownUser';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserStatuses } from 'Interfaces/User';
import { PlanIds, PlanTypes, signatureLimitedPlans } from 'Interfaces/Billing';

import UIButton from 'Components/UIComponents/UIButton';
import HelpIcon from 'Assets/images/icons/help-icon.svg';
import DropDownMenu from 'Components/DropDownMenu';
import useIsMobile from 'Hooks/Common/useIsMobile';
import BlackFridayBanner from 'Components/Header/BlackFridayBanner';
import Toast from 'Services/Toast';
import AddTeamMemberButton from './AddTeamMemberButton';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import EndOfYearBanner from './EndOfYearBanner';
import classNames from 'classnames';
import TrialBanner from './TrialBanner';
import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';

export interface HeaderProps {
  location: Location;
  isActionHidden?: boolean;
  headerClassName?: string;
}

function Header({ location, headerClassName, isActionHidden = false }: HeaderProps) {
  const [logout] = useLogout();
  const user: User = useSelector(selectUser);
  const {
    freeDocumentsUsedLimit,
    freeDocumentsUsed,
    isTrialUsed,
    teamId,
    personalDocumentsUsedLimit,
    personalDocumentsUsed,
    plan,
  } = useSelector(selectUser);
  const isMobile = useIsMobile();

  const signatureCounterByType = {
    [PlanTypes.FREE]: `${freeDocumentsUsed} of ${freeDocumentsUsedLimit} signature requests`,
    [PlanTypes.PERSONAL]: `${personalDocumentsUsed} of ${personalDocumentsUsedLimit} signature requests`,
  };

  useEffect(() => {
    if (user.status === UserStatuses.FREEZE) {
      Toast.warn(
        'Your current subscription has not been paid; the account has been disabled. Please check your payment method.',
        { toastId: 'unpaid_toast' },
      );
    }
  }, [user.status]);

  const isSignaturesLimited = useMemo(
    () => signatureLimitedPlans.includes(user.plan.id as PlanIds) && !user.teamId,
    [user.plan, user.teamId],
  );

  const isTrialAvailable = useMemo(
    () => user?.plan?.type === PlanTypes.FREE && !isTrialUsed && !teamId,
    [isTrialUsed, teamId, user],
  );

  const isSomeSale = useMemo(() => IS_BLACK_FRIDAY || IS_END_OF_YEAR, []);

  return (
    <header className={'header__wrapper'}>
      {!isActionHidden && (
        <>
          <BlackFridayBanner />
          <EndOfYearBanner />
        </>
      )}
      {!isActionHidden && isTrialAvailable && !isSomeSale && <TrialBanner />}
      <div className={classNames('header', headerClassName)}>
        <Link to={!isActionHidden ? AuthorizedRoutePaths.BASE_PATH : location}>
          <img src={Logo} alt="Signaturely" />
        </Link>
        {!isMobile && isSignaturesLimited && !isActionHidden && (
          <div className="header__month-wrapper">
            <div className="header__counter-wrapper">
              <p className="header__month-counter">
                {signatureCounterByType[plan.type]}
                <span className="header__left-month-text">this month</span>
              </p>
            </div>

            <Link to={AuthorizedRoutePaths.SETTINGS_BILLING_PLAN}>
              <UIButton priority="primary" title="Upgrade" />
            </Link>
          </div>
        )}
        {!isMobile &&
          !isActionHidden &&
          (isSignaturesLimited || (isTrialAvailable && isSomeSale)) && (
            <div className="header__divider" />
          )}
        <div className="header__action-wrapper">
          {isMobile ? (
            <DropDownMenu
              location={location}
              handleLogout={logout}
              isSignaturesLimited={isSignaturesLimited}
              isActionHidden={isActionHidden}
            />
          ) : (
            <>
              <AddTeamMemberButton />
              <DropDownUser
                location={location}
                handleLogout={logout}
                isActionHidden={isActionHidden}
              />
              <a
                href={'https://help.signaturely.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className={`header__help header__help--stroke`}
              >
                <ReactSVG src={HelpIcon} className="header__help-icon" />
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
