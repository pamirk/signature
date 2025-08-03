import React from 'react';
import useDropdown from 'use-dropdown';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import RemoveIcon from 'Assets/images/icons/remove-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import IconSelectArrow from 'Assets/images/icons/select-arrow-icon.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';

export enum GridActionTypes {
  MOVE_TO = 'moveTo',
  DELETE = 'delete',
  DOWNLOAD = 'download',
}

const iconsByActionType = {
  [GridActionTypes.MOVE_TO]: IconFolder,
  [GridActionTypes.DELETE]: RemoveIcon,
  [GridActionTypes.DOWNLOAD]: DownloadIcon,
};

export interface GridActionOption {
  type: GridActionTypes;
  title?: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

interface GridActionsDropdownProps {
  options: GridActionOption[];
}

const GridActionsDropdown = ({ options = [] }: GridActionsDropdownProps) => {
  const [containerRef, isOpen, open, close] = useDropdown();
  const toggleDropdown = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return (
    <div className="grid__dropDown" ref={containerRef} onClick={toggleDropdown}>
      <div
        className={classNames('grid__dropDown-wrapper', {
          'grid__dropDown-wrapper--open': isOpen,
        })}
      >
        <div className="grid__dropDown-inner">
          <div
            className={classNames('grid__dropDown-trigger', {
              'grid__dropDown-trigger--open': isOpen,
            })}
          >
            Select options
            <ReactSVG
              src={IconSelectArrow}
              className={classNames('grid__dropDown-trigger-arrow', {
                'grid__dropDown-trigger-arrow--open': isOpen,
              })}
            />
          </div>
        </div>
      </div>
      {isOpen && options.length && (
        <div className="grid__dropDown-list">
          {options.map((option, index) => (
            <div key={index} className="grid__dropDown-itemWrapper">
              <div
                className={classNames(
                  'grid__dropDown-item',
                  {
                    'grid__dropDown-item--move':
                      option.type === GridActionTypes.MOVE_TO ||
                      option.type === GridActionTypes.DOWNLOAD,
                    'grid__dropDown-item--delete': option.type === GridActionTypes.DELETE,
                  },
                  option.className,
                )}
                onClick={option.onClick}
              >
                <ReactSVG
                  src={option.icon || iconsByActionType[option.type]}
                  className="grid__dropDown-item-icon"
                />
                <p className="grid__dropDown-item-label">{option.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridActionsDropdown;
