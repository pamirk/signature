import React, { useMemo } from 'react';
import { Location } from 'history';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { settingsNavItems } from './SettingsNavItems';
import useIsMobile from 'Hooks/Common/useIsMobile';

export interface SettingsNavigationProps {
  location: Location;
}

function SettingsNavigation({ location }: SettingsNavigationProps) {
  const isMobile = useIsMobile();
  return (
    <div className="settingsNav__list">
      {settingsNavItems.map((item, index) => {
        const { pathname } = location;
        const { path, label, icon, classNameMod } = item;
        const isActive = pathname.startsWith(path);
        return (
          <Link
            key={index}
            to={path}
            className={classNames(
              `settingsNav__item settingsNav__item--${classNameMod}`,
              {
                'settingsNav__item--active': isActive,
                mobile: isMobile,
              },
            )}
          >
            {!isMobile && <ReactSVG src={icon} className="settingsNav__item-icon" />}
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default SettingsNavigation;
