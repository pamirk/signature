import React, { useMemo } from 'react';
import { Location } from 'history';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import Logo from 'Assets/images/logo.svg';
import { useLogout } from 'Hooks/Auth';
import DropDownUser from '../DropDownUser';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';

import UIButton from 'Components/UIComponents/UIButton';
import HelpIcon from 'Assets/images/icons/help-icon.svg';
import DropDownMenu from 'Components/DropDownMenu';
import useIsMobile from 'Hooks/Common/useIsMobile';

export interface HeaderProps {
  location: Location;
}

function Header({ location }: HeaderProps) {
  const logout = useLogout();
  const user: User = useSelector(selectUser);
  const { freeDocumentsUsedLimit, freeDocumentsUsed } = useSelector(selectUser);
  const isMobile = useIsMobile();

  const isSignaturesLimited = useMemo(
    () => user.plan.type === PlanTypes.FREE && !user.teamId,
    [user.plan, user.teamId],
  );

  return (
    <header className="header__wrapper">
      <div className="header">
        <Link to="/">
          <img src={Logo} alt="Signaturely" />
        </Link>

        {!isMobile && isSignaturesLimited && (
          <div className="header__month-wrapper">
            <div className="header__counter-wrapper">
              <p className="header__month-counter">
                {`${freeDocumentsUsed} of ${freeDocumentsUsedLimit} signature requests`}
                <span className="header__left-month-text">this month</span>
              </p>
            </div>

            <Link to="/settings/billing/plan">
              <UIButton priority="primary" title="Upgrade" />
            </Link>
          </div>
        )}
        <div className="header__action-wrapper">
          {isMobile ? (
            <DropDownMenu
              location={location}
              handleLogout={logout}
              isSignaturesLimited={isSignaturesLimited}
            />
          ) : (
            <>
              <DropDownUser location={location} handleLogout={logout} />
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
