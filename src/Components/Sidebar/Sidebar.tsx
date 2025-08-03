import React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import { ReactSVG } from 'react-svg';
import { NavLink } from 'react-router-dom';
import { Location } from 'history';
import { sidebarItems } from './SidebarItems';
import SelectIcon from 'Assets/images/icons/select-arrow-icon.svg';
import { useSelector } from 'react-redux';
import { selectUserPlan } from 'Utils/selectors';
import { PlanTypes } from 'Interfaces/Billing';
import classNames from 'classnames';

export interface SidebarProps {
  location: Location;
}

function Sidebar({ location }: SidebarProps) {
  const userPlan = useSelector(selectUserPlan);

  return (
    <div className="sidebar__wrapper">
      <Accordion className="sidebar__list">
        {sidebarItems.map((item, index) => {
          const { path, classNameMod, label, icon, subLinks, iconClassName } = item;
          const { pathname } = location;
          const isExpanded =
            pathname.startsWith(path) || subLinks.find(i => i.subPath === pathname);
          const isSubLinks = subLinks.length > 0;

          return (
            <AccordionItem
              key={index}
              title={
                <NavLink
                  to={path}
                  className={`sidebar__item-trigger sidebar__item-trigger--${classNameMod}`}
                >
                  <div className="sidebar__item-trigger-inner">
                    <ReactSVG
                      src={icon}
                      className={classNames('sidebar__item-trigger-icon', iconClassName)}
                    />
                    {label}
                  </div>
                  {isSubLinks && (
                    <ReactSVG src={SelectIcon} className="sidebar__item-trigger-arrow" />
                  )}
                </NavLink>
              }
              expanded={isExpanded}
              titleClassName="sidebar__item-title"
              className="sidebar__item"
              expandedClassName="sidebar__item--expanded"
            >
              {!!subLinks.length && (
                <div className="sidebar__item-link-list">
                  {subLinks.map((item, index) => {
                    const { subPath, label, status, externalUrl, freePlanSubPath } = item;
                    const path =
                      (userPlan.type === PlanTypes.FREE && freePlanSubPath) || subPath;
                    const className = `sidebar__item-link ${
                      status
                        ? `sidebar__item-link-status sidebar__item-link-status--${status}`
                        : ''
                    }`;
                    return externalUrl ? (
                      <a
                        key={label}
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar__item-link"
                      >
                        {label}
                      </a>
                    ) : (
                      <NavLink
                        key={index}
                        to={path}
                        className={className}
                        activeClassName="sidebar__item-link--active"
                      >
                        {label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default Sidebar;
