import React, { useCallback } from 'react';
import useDropdown from 'use-dropdown';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import { SelectableOption } from 'Interfaces/Common';

import SelectIcon from 'Assets/images/icons/select-arrow-icon.svg';
import CloseIcon from 'Assets/images/icons/close-icon.svg';
import UISpinner from './UISpinner';

export interface UISelectProps<TValue> {
  handleSelect: (value?: TValue) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: SelectableOption<TValue>[];
  children?: Node;
  value?: TValue | null;
  placeholder: string;
  contentWrapperClassName?: string;
  icon?: string;
  emptyText?: string;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

function UISelect<TValue>({
  options,
  placeholder,
  icon,
  value,
  contentWrapperClassName,
  handleSelect,
  onBlur,
  onFocus,
  emptyText,
  isClearable = false,
  disabled = false,
  isLoading,
}: UISelectProps<TValue>) {
  const [containerRef, isOpen, open, close] = useDropdown();

  const selectedOption =
    options.find(option => option.value === value) || ({} as typeof options[0]);

  const { label } = selectedOption;

  const addItem = item => {
    handleSelect(item.value);
    close();
  };

  const onClear = e => {
    e.stopPropagation();
    handleSelect(undefined);
  };

  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      onBlur && onBlur();
      close();
    } else {
      onFocus && onFocus();
      open();
    }
  }, [disabled, isOpen, onBlur, close, onFocus, open]);

  return (
    <div className="uiSelect__wrapper" ref={containerRef}>
      <div
        className={classNames('uiSelect__select', {
          'uiSelect__select--open': isOpen,
          'uiSelect__select--disabled': disabled,
        })}
        onClick={toggleDropdown}
      >
        <div
          className={`uiSelect__select-inner ${
            isClearable ? 'uiSelect__select-inner--isClear' : ''
          }`}
        >
          {icon && <ReactSVG src={icon} className="uiSelect__select-icon-before" />}
          <div className={`uiSelect__select-value-wrapper `}>
            {label ? (
              <p className="uiSelect__select-value">{label}</p>
            ) : (
              <p className="uiSelect__select-placeholder">{placeholder}</p>
            )}
          </div>
        </div>

        {isClearable && (
          <ReactSVG
            src={CloseIcon}
            onClick={e => onClear(e)}
            className="uiSelect__clear"
          />
        )}

        {isLoading ? (
          <UISpinner />
        ) : (
          <ReactSVG src={SelectIcon} className="uiSelect__select-arrow" />
        )}
      </div>
      {isOpen && (
        <div className={classNames('uiSelect__content-wrapper', contentWrapperClassName)}>
          {options && options.length > 0 ? (
            <div className="uiSelect__search-list">
              {options
                .filter(item => !(item.value === selectedOption.value))
                .map((item, index) => {
                  const { label: optionLabel } = item;
                  return (
                    <div
                      key={index}
                      onClick={() => addItem(item)}
                      className="uiSelect__search-item"
                    >
                      <p className="uiSelect__select-row">{optionLabel}</p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="uiSelect__empty">{emptyText || 'Empty list'}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UISelect;
