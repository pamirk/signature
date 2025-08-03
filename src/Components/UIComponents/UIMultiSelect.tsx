import IconSelectArrow from 'Assets/images/icons/select-arrow-icon.svg';
import CloseIcon from 'Assets/images/icons/select-cross-icon.svg';
import React from 'react';
import Select from 'react-select';
import { ReactSVG } from 'react-svg';

type MultiValue<T> = readonly T[];

export interface UIMultiSelectProps {
  options: Array<{ value: string; label: string }>;
  filterOption?: (
    option: { value: string; label: string },
    inputValue: string,
  ) => boolean;
  onChange: (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: any,
  ) => void;
  isLoading?: boolean;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
}

function UIMultiSelect({
  options,
  filterOption,
  onChange,
  isLoading,
  placeholder,
  closeMenuOnSelect = false,
}: UIMultiSelectProps) {
  const ArrowIcon = ({ innerRef, innerProps }: any) => {
    return (
      <div className={'uiMultiSelect__dropdownIcon_wrapper'}>
        <ReactSVG
          src={IconSelectArrow}
          innerRef={innerRef}
          className="uiMultiSelect__dropdownIcon"
          // beforeInjection={svg => {
          //   const [firstPathElement] = [...svg.querySelectorAll('path')];
          //   firstPathElement.setAttribute('stroke', '#d7e3e7');
          //   firstPathElement.setAttribute('transition', 'all 0.2s ease');
          // }}
          //
          // style={{
          //   transition: 'all 0.2s ease',
          //   transform: selectProps.menuIsOpen ? 'rotate(-180deg)' : 'none',
          // }}
          {...innerProps}
        />
      </div>
    );
  };

  const CrossIcon = ({ innerRef, innerProps }: any) => {
    return (
      <div className="uiMultiSelect__closeIcon_wrapper">
        <ReactSVG
          src={CloseIcon}
          innerRef={innerRef}
          className={'uiMultiSelect__closeIcon'}
          // beforeInjection={svg => {
          //   const [firstPathElement] = [...svg.querySelectorAll('path')];
          //   firstPathElement.setAttribute('stroke', '#d7e3e7');
          //   firstPathElement.setAttribute('transition', 'all 0.2s ease');
          // }}
          {...innerProps}
        />
      </div>
    );
  };

  const IndicatorSeparator = () => <></>;

  return (
    <Select
      isMulti
      classNamePrefix="uiMultiSelect"
      options={options}
      isLoading={isLoading}
      onChange={onChange}
      filterOption={filterOption}
      placeholder={placeholder}
      components={{
        DropdownIndicator: ArrowIcon,
        ClearIndicator: CrossIcon,
        IndicatorSeparator,
      }}
      unstyled
      autoFocus={false}
      closeMenuOnSelect={closeMenuOnSelect}
    />
  );
}

export default UIMultiSelect;
