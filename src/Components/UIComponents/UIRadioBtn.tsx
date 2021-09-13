import React from 'react';
import classNames from 'classnames';

export interface UIRadioBtnProps {
  handleCheck: (isChecked: boolean, value: string | undefined) => void;
  label?: string;
  value?: string;
  isChecked: boolean;
}

function UIRadioBtn({ label, value, handleCheck, isChecked = false }: UIRadioBtnProps) {
  return (
    <div className="radio-button__wrapper" onClick={() => handleCheck(isChecked, value)}>
      <div
        className={classNames('radio-button', {
          'radio-button--checked': isChecked,
          'radio-button--unchecked': !isChecked,
        })}
      />
      <label className="radio-button__label">{label}</label>
    </div>
  );
}

export default UIRadioBtn;
