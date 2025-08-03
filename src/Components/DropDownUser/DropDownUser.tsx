import React, { useEffect } from 'react';
import useDropdown from 'use-dropdown';
import classNames from 'classnames';
import { Location } from 'history';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';

import ArrowIcon from 'Assets/images/icons/select-arrow-icon.svg';
import CompanyIcon from 'Assets/images/icons/company-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';
import BillingIcon from 'Assets/images/icons/billing-icon.svg';
import LogoutIcon from 'Assets/images/icons/logout-icon.svg';
import StarIcon from 'Assets/images/icons/star-icon.svg';

import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';
import AccountAvatar from 'Components/AccountAvatar';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

export interface DropDownUserProps {
  handleLogout: (v: void) => void;
  location: Location;
  isActionHidden?: boolean;
}

const LINKS = [
  {
    label: 'Company',
    url: AuthorizedRoutePaths.SETTINGS_COMPANY,
    className: 'dropDownUser__item--fill',
    icon: CompanyIcon,
  },
  {
    label: 'Profile',
    url: AuthorizedRoutePaths.SETTINGS_PROFILE,
    className: 'dropDownUser__item--stroke',
    icon: TeamIcon,
  },
  /*   {
    label: 'API',
    url: '/settings/api',
    className: 'dropDownUser__item--stroke',
    icon: IntegrationsIcon,
  }, */
  {
    label: 'Edit Signature',
    url: AuthorizedRoutePaths.SETTINGS_EDIT_SIGNATURE,
    className: 'dropDownUser__item--stroke',
    icon: EditIcon,
  },
  {
    label: 'Billing',
    url: AuthorizedRoutePaths.SETTINGS_BILLING,
    freeUrl: AuthorizedRoutePaths.SETTINGS_BILLING_PLAN,
    className: 'dropDownUser__item--stroke',
    icon: BillingIcon,
  },
];

const REDIRECT_LINK = [
  {
    label: 'Share & Earn',
    url: 'https://refer.signaturely.com/',
    className: 'dropDownUser__item--stroke',
    icon: StarIcon,
  },
];

function DropDownUser({ handleLogout, location, isActionHidden }: DropDownUserProps) {
  const user: User = useSelector(selectUser);
  const [containerRef, isOpen, open, close] = useDropdown();
  const { pathname } = location;
  useEffect(close, [close, pathname]);

  return (
    <div className="dropDownUser__wrapper" ref={containerRef}>
      <div className="dropDownUser__trigger" onClick={isOpen ? close : open}>
        <AccountAvatar />
        <p className="dropDownUser__trigger-name">{user.name}</p>
        <ReactSVG
          src={ArrowIcon}
          className={classNames('dropDownUser__trigger-arrow', {
            'dropDownUser__trigger-arrow--open': isOpen,
          })}
        />
      </div>

      {isOpen && (
        <div className="dropDownUser__list">
          {!isActionHidden && (
            <>
              {LINKS.map(link => {
                const url =
                  (user.plan.type === PlanTypes.FREE && link.freeUrl) || link.url;

                return (
                  <Link
                    key={link.label}
                    to={url}
                    className={`dropDownUser__item ${link.className}`}
                  >
                    <ReactSVG src={link.icon} className="dropDownUser__item-icon" />
                    {link.label}
                  </Link>
                );
              })}
              {REDIRECT_LINK.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`dropDownUser__item ${link.className}`}
                  onClick={close}
                >
                  <ReactSVG src={link.icon} className="dropDownUser__item-icon" />
                  {link.label}
                </a>
              ))}
            </>
          )}
          <div
            onClick={() => handleLogout(undefined)}
            className="dropDownUser__item dropDownUser__item--fill"
          >
            <ReactSVG src={LogoutIcon} className="dropDownUser__item-icon" />
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownUser;
