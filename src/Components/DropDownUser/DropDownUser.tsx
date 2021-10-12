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
import FeedbackIcon from 'Assets/images/icons/feedback-icon.svg';

import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';
import { Avatar } from 'Components/Avatar/Avatar';
import AccountAvatar from 'Components/AccountAvatar';

export interface DropDownUserProps {
  handleLogout: () => void;
  location: Location;
}

const LINKS = [
  // {
  //   label: 'Company',
  //   url: '/settings/company',
  //   className: 'dropDownUser__item--fill',
  //   icon: CompanyIcon,
  // },
  // {
  //   label: 'Profile',
  //   url: '/settings/profile',
  //   className: 'dropDownUser__item--stroke',
  //   icon: TeamIcon,
  // },
  /*   {
    label: 'API',
    url: '/settings/api',
    className: 'dropDownUser__item--stroke',
    icon: IntegrationsIcon,
  }, */
  {
    label: 'Edit Signature',
    url: '/settings/edit-signature',
    className: 'dropDownUser__item--stroke',
    icon: EditIcon,
  },
  // {
  //   label: 'Billing',
  //   url: '/settings/billing',
  //   freeUrl: '/settings/billing/plan',
  //   className: 'dropDownUser__item--stroke',
  //   icon: BillingIcon,
  // },
];

const REDIRECT_LINK = [
  {
    label: 'Feedback',
    url: 'https://feedback.signaturely.com/',
    className: 'dropDownUser__item--stroke',
    icon: FeedbackIcon,
  },
  {
    label: 'Share & Earn',
    url: 'https://refer.signaturely.com/',
    className: 'dropDownUser__item--stroke',
    icon: StarIcon,
  },
];

function DropDownUser({ handleLogout, location }: DropDownUserProps) {
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
          {LINKS.map(link => {
            const url = (user.plan.type === PlanTypes.FREE) || link.url;

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
        {/*  {REDIRECT_LINK.map(link => (
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
          ))}*/}

          <div
            onClick={handleLogout}
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
