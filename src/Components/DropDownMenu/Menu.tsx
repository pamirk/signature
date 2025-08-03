import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import SettingsIcon from 'Assets/images/icons/settings-icon.svg';
import DocumentsIcon from 'Assets/images/icons/documents-icon.svg';
import TemplatesIcon from 'Assets/images/icons/templates-icon.svg';
import TeamIcon from 'Assets/images/icons/team-icon.svg';
import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import LogoutIcon from 'Assets/images/icons/logout-icon.svg';
import ArrowIcon from 'Assets/images/icons/angle-arrow.svg';
import CompanyIcon from 'Assets/images/icons/company-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';
import BillingIcon from 'Assets/images/icons/billing-icon.svg';
import FormsIcon from 'Assets/images/icons/forms-icon.svg';
import { ReactSVG } from 'react-svg';
import { useBeaconRemove, useBodyScrollStop } from 'Hooks/Common';
import classNames from 'classnames';
import AccountAvatar from 'Components/AccountAvatar';
import { useSelector } from 'react-redux';
import { User } from 'Interfaces/User';
import { selectUser } from 'Utils/selectors';
import HelpIcon from 'Assets/images/icons/help-icon.svg';
import UIButton from 'Components/UIComponents/UIButton';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { PlanTypes } from 'Interfaces/Billing';

const LINKS = [
  {
    label: 'Sign',
    url: AuthorizedRoutePaths.SIGN,
    className: 'dropDownMenu__item--fill',
    icon: SignIcon,
  },
  {
    label: 'Documents',
    url: AuthorizedRoutePaths.DOCUMENTS,
    className: 'dropDownMenu__item--stroke',
    icon: DocumentsIcon,
    subMenu: [
      {
        label: 'Completed',
        url: `${AuthorizedRoutePaths.DOCUMENTS}/completed`,
        icon: DocumentsIcon,
      },
      {
        label: 'Awaiting Signature',
        url: `${AuthorizedRoutePaths.DOCUMENTS}/awaiting`,
        icon: DocumentsIcon,
      },
      {
        label: 'Voided',
        url: `${AuthorizedRoutePaths.DOCUMENTS}/voided`,
        icon: DocumentsIcon,
      },
      {
        label: 'Draft',
        url: `${AuthorizedRoutePaths.DOCUMENTS}/draft`,
        icon: DocumentsIcon,
      },
      {
        label: 'Received',
        url: AuthorizedRoutePaths.RECEIVED_DOCUMENTS,
        icon: DocumentsIcon,
      },
      {
        label: 'Trash',
        url: AuthorizedRoutePaths.TRASH,
        icon: DocumentsIcon,
      },
    ],
  },
  {
    label: 'Templates',
    url: AuthorizedRoutePaths.TEMPLATES,
    className: 'dropDownMenu__item--stroke',
    icon: TemplatesIcon,
    subMenu: [
      {
        label: 'Create Template',
        url: `${AuthorizedRoutePaths.TEMPLATES}/create`,
        icon: TemplatesIcon,
      },
      {
        label: 'Templates View',
        url: `${AuthorizedRoutePaths.TEMPLATES}/active`,
        icon: TemplatesIcon,
      },
      {
        label: 'API Templates',
        url: `${AuthorizedRoutePaths.TEMPLATES}/api`,
        icon: TemplatesIcon,
      },
    ],
  },
  {
    label: 'Forms',
    url: AuthorizedRoutePaths.FORM_REQUESTS,
    className: 'dropDownMenu__item--stroke',
    icon: FormsIcon,
  },
  {
    label: 'Team',
    url: AuthorizedRoutePaths.TEAM,
    freeUrl: AuthorizedRoutePaths.SETTINGS_BILLING_PLAN,
    className: 'dropDownMenu__item--stroke',
    icon: TeamIcon,
  },
  {
    label: 'Integrations',
    url: AuthorizedRoutePaths.INTEGRATIONS,
    freeUrl: AuthorizedRoutePaths.SETTINGS_BILLING_PLAN,
    className: 'dropDownMenu__item--stroke',
    icon: IntegrationsIcon,
  },
  {
    label: 'Settings',
    url: AuthorizedRoutePaths.SETTINGS_PROFILE,
    freeUrl: AuthorizedRoutePaths.SETTINGS_BILLING_PLAN,
    className: 'dropDownMenu__item--stroke',
    icon: SettingsIcon,
    subMenu: [
      {
        label: 'Company',
        url: AuthorizedRoutePaths.SETTINGS_COMPANY,
        icon: CompanyIcon,
      },
      {
        label: 'Profile',
        url: AuthorizedRoutePaths.SETTINGS_PROFILE,
        icon: TeamIcon,
      },
      {
        label: 'Edit Signature',
        url: AuthorizedRoutePaths.SETTINGS_EDIT_SIGNATURE,
        icon: EditIcon,
      },
      {
        label: 'Billing',
        url: AuthorizedRoutePaths.SETTINGS_BILLING,
        icon: BillingIcon,
      },
    ],
  },
];

const LabelsWithArrow = ['Documents', 'Templates', 'Settings'];

interface MenuParams {
  handleLogout: (v: void) => void;
  isSignaturesLimited: boolean;
  isActionHidden?: boolean;
}

export const Menu = ({
  handleLogout,
  isSignaturesLimited,
  isActionHidden,
}: MenuParams) => {
  const user: User = useSelector(selectUser);
  const [activeItem, setActiveItem] = useState<string>('');
  const [isUserDropDown, setUserDropDown] = useState<boolean>(false);
  useBodyScrollStop();
  useBeaconRemove();

  const {
    freeDocumentsUsedLimit,
    freeDocumentsUsed,
    personalDocumentsUsedLimit,
    personalDocumentsUsed,
    plan,
  } = useSelector(selectUser);

  const signatureCounterByType = {
    [PlanTypes.FREE]: `${freeDocumentsUsed} of ${freeDocumentsUsedLimit} signature requests`,
    [PlanTypes.PERSONAL]: `${personalDocumentsUsed} of ${personalDocumentsUsedLimit} signature requests`,
  };

  const handleLinkClick = useCallback(
    link => {
      if (activeItem === link.label) {
        return setActiveItem('');
      }

      if (LabelsWithArrow.includes(link.label)) {
        return setActiveItem(link.label);
      }
    },
    [activeItem],
  );

  const handleUserClick = useCallback(() => {
    setUserDropDown(prev => !prev);
  }, []);

  return (
    <div className="dropDownMenu__list">
      {isSignaturesLimited && !isActionHidden && (
        <div className="dropDownMenu__item header__month-wrapper">
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
      {!isActionHidden &&
        LINKS.map(link => {
          return (
            <>
              <div
                onClick={() => handleLinkClick(link)}
                key={link.label}
                className={classNames('dropDownMenu__item', link.className, {
                  active: link.label === activeItem,
                })}
              >
                <div className="dropDownMenu__item-title">
                  <Link
                    to={link.url}
                    className={classNames('dropDownMenu__item', link.className, {
                      active: link.label === activeItem,
                    })}
                  >
                    <ReactSVG src={link.icon} className="dropDownMenu__item-icon" />
                    {link.label}
                  </Link>
                </div>
                {link.subMenu ? (
                  <ReactSVG
                    src={ArrowIcon}
                    className={classNames('dropDownMenu__item-icon', 'arrow', {
                      active: link.label === activeItem,
                    })}
                  />
                ) : null}
              </div>
              {link.label === activeItem && link.subMenu ? (
                <div className="dropDownMenu__sublist">
                  {link.subMenu.map(sublink => (
                    <Link
                      key={sublink.label}
                      to={sublink.url}
                      className={classNames('dropDownMenu__item subitem', link.className)}
                    >
                      <div className="dropDownMenu__item-title">{sublink.label}</div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          );
        })}
      <div className={classNames('dropDownMenu__footer', { open: isUserDropDown })}>
        <div className="dropDownMenu__footer-user" onClick={handleUserClick}>
          <AccountAvatar />
          <p>{user.name}</p>
          <ReactSVG
            src={ArrowIcon}
            className={classNames('dropDownMenu__footer-icon', 'arrow', {
              active: isUserDropDown,
            })}
          />
        </div>
        <a
          href={'https://help.signaturely.com/'}
          target="_blank"
          rel="noopener noreferrer"
          className={`dropDownMenu__help header__help--stroke`}
        >
          <ReactSVG src={HelpIcon} className="header__help-icon" />
        </a>
        {isUserDropDown ? (
          <div className="dropDownMenu__footer-sublist">
            {!isActionHidden &&
              LINKS[6].subMenu &&
              LINKS[6].subMenu.map(sublink => (
                <Link
                  key={sublink.label}
                  to={sublink.url}
                  className={classNames('dropDownMenu__item subitem')}
                >
                  <ReactSVG src={sublink.icon} className="dropDownMenu__item-icon" />
                  <div className="dropDownMenu__item-title">{sublink.label}</div>
                </Link>
              ))}
            <div className="dropDownMenu__item subitem dropDownMenu__item--fill logout">
              <div
                className="dropDownMenu__item-title"
                onClick={() => handleLogout(undefined)}
              >
                <ReactSVG src={LogoutIcon} className="dropDownMenu__item-icon red" />
                Logout
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
