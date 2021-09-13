import React from 'react';
// @ts-ignore
import useDropdown from 'use-dropdown';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';

export enum RequisiteActionTypes {
  EDIT = 'edit',
  DELETE = 'delete',
}

const iconsByActionType = {
  [RequisiteActionTypes.EDIT]: EditIcon,
  [RequisiteActionTypes.DELETE]: RemoveIcon,
};

export interface RequisiteActionOption {
  type: RequisiteActionTypes;
  title?: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

interface RequisiteActionsDropdownProps {
  options: RequisiteActionOption[];
}

const RequisiteActionsDropdown = ({ options = [] }: RequisiteActionsDropdownProps) => {
  const [containerRef, isOpen, open] = useDropdown();

  return (
    <div className="settingsSignature__dropDown-wrapper" ref={containerRef}>
      <div className="settingsSignature__dropDown-inner">
        <div className="settingsSignature__dropDown-trigger" onClick={open}>
          <span />
          <span />
          <span />
        </div>
        {isOpen && options.length && (
          <div className="settingsSignature__dropDown-list">
            {options.map((option, index) => (
              <div
                key={index}
                className={classNames(
                  'settingsSignature__dropDown-item',
                  {
                    'settingsSignature__dropDown-item--edit':
                      option.type === RequisiteActionTypes.EDIT,
                    'settingsSignature__dropDown-item--delete':
                      option.type === RequisiteActionTypes.DELETE,
                  },
                  option.className,
                )}
                onClick={option.onClick}
              >
                <ReactSVG
                  src={option.icon || iconsByActionType[option.type]}
                  className="settingsSignature__dropDown-item-icon"
                />
                <p className="settingsSignature__dropDown-item-label">{option.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisiteActionsDropdown;
