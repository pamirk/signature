import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { ReactSVG } from 'react-svg';
import useDropdown from 'use-dropdown';

import { SelectableOption } from 'Interfaces/Common';

import CloseIcon from 'Assets/images/icons/close-icon.svg';
import SelectIcon from 'Assets/images/icons/select-arrow-icon.svg';
import IconSearch from 'Assets/images/icons/search.svg';
import UISpinner from './UISpinner';
import UITextInput from './UITextInput';

export interface UISelectProps<TValue> {
  handleSelect: (value?: TValue) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: SelectableOption<TValue>[];
  children?: Node;
  value?: TValue | null;
  placeholder: string;
  contentWrapperClassName?: string;
  className?: string;
  icon?: string;
  emptyText?: string;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  searchInputPlaceholder?: string;
  searchWrapperClassName?: string;
}

function UISelect<TValue>({
  options,
  placeholder,
  icon,
  value,
  contentWrapperClassName,
  className,
  handleSelect,
  onBlur,
  onFocus,
  emptyText,
  isClearable = false,
  disabled = false,
  isLoading,
  isSearchable = false,
  searchInputPlaceholder,
  searchWrapperClassName,
}: UISelectProps<TValue>) {
  const [containerRef, isOpen, open, close] = useDropdown();

  const selectedOption =
    options.find(option => option.value === value) || ({} as typeof options[0]);

  const [filteredOptions, setFilteredOptions] = useState<SelectableOption<TValue>[]>(
    options,
  );

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

    setFilteredOptions(options);

    if (isOpen) {
      onBlur && onBlur();
      close();
    } else {
      onFocus && onFocus();
      open();
    }
  }, [disabled, options, isOpen, onBlur, close, onFocus, open]);

  const handleFilterOptions = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const searchString = event.currentTarget.value.trim().toLowerCase();

      const searchOptions = options.filter(
        option => option.label.toLowerCase().indexOf(searchString) !== -1,
      );

      setFilteredOptions(searchOptions);
    },
    [options],
  );

  const isNotEmptyOptions =
    filteredOptions && filteredOptions.length > 0 && options.length > 0;

  const isNoSearchOptions =
    filteredOptions && filteredOptions.length === 0 && options.length > 0;

  return (
    <div className={classNames('uiSelect__wrapper', className)} ref={containerRef}>
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
        <div className={isSearchable ? searchWrapperClassName : undefined}>
          {isSearchable && (
            <UITextInput
              inputClassName="uiSelect__search-string"
              placeholder={searchInputPlaceholder}
              onKeyUp={handleFilterOptions}
              onKeyDown={event => {
                if (event.key === 'Enter') event.preventDefault();
              }}
              icon={IconSearch}
            />
          )}
          <div
            className={classNames('uiSelect__content-wrapper', contentWrapperClassName)}
          >
            {isNotEmptyOptions ? (
              <div className="uiSelect__search-list">
                {filteredOptions
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
            ) : isSearchable && isNoSearchOptions ? (
              <p className="uiSelect__empty">No search results found.</p>
            ) : (
              <p className="uiSelect__empty">{emptyText || 'Empty list'}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UISelect;
