import React from 'react';
import classNames from 'classnames';

export interface UIRadioBtnProps {
  handleCheck: (isChecked: boolean, value: string | undefined) => void;
  label?: string;
  value?: string;
  isDisabled?: boolean;
  isChecked: boolean;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: () => void;
}

function UIRadioBtn({
  label,
  value,
  handleCheck,
  isChecked = false,
  onMouseEnter,
  onMouseLeave,
  isDisabled,
}: UIRadioBtnProps) {
  return (
    <div
      className={classNames('radio-button__wrapper', {
        'radio-button__wrapper--disabledChecked': isDisabled,
      })}
      onClick={() => !isDisabled && handleCheck(isChecked, value)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={classNames('radio-button', {
          'radio-button--checked': isChecked,
          'radio-button--unchecked': !isChecked,
          'radio-button--disabledChecked': isDisabled && isChecked,
        })}
      />
      <label className="radio-button__label">{label}</label>
    </div>
  );
}

export default UIRadioBtn;
