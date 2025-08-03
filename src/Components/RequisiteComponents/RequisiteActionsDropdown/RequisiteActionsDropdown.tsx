import React from 'react';
import useDropdown from 'use-dropdown';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import EditIcon from 'Assets/images/icons/edit-icon.svg';

// eslint-disable-next-line react-refresh/only-export-components
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
  const [containerRef, isOpen, open, close] = useDropdown();

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
            {options.map((option, index) => {
              const { type, title, icon, className, onClick } = option;
              return (
                <div
                  key={index}
                  className={classNames(
                    'settingsSignature__dropDown-item',
                    {
                      'settingsSignature__dropDown-item--edit':
                        type === RequisiteActionTypes.EDIT,
                      'settingsSignature__dropDown-item--delete':
                        type === RequisiteActionTypes.DELETE,
                    },
                    className,
                  )}
                  onClick={() => {
                    close();
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    onClick && onClick();
                  }}
                >
                  <ReactSVG
                    src={icon || iconsByActionType[type]}
                    className="settingsSignature__dropDown-item-icon"
                  />
                  <p className="settingsSignature__dropDown-item-label">{title}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisiteActionsDropdown;
