import React from 'react';
import classNames from 'classnames';
import RadioButton from './RadioButton';

interface DurationSwitcherProps {
  isActive?: boolean;
  onClick: () => void;
  discountText?: string;
  text: string;
}

const DurationSwitcher = ({
  isActive,
  onClick,
  discountText,
  text,
}: DurationSwitcherProps) => {
  return (
    <div
      className={classNames('switch-block', {
        'switch-block--active': isActive,
      })}
      onClick={onClick}
    >
      <div className="switch-block__radio-button-wrapper">
        <RadioButton isActive={isActive} />
      </div>
      <div className="switch-block__text">{text}</div>
      {discountText && (
        <div className="switch-block__discount">
          <div className="billing__discount">{discountText}</div>
        </div>
      )}
    </div>
  );
};

export default DurationSwitcher;
