import React from 'react';
import classNames from 'classnames';

interface RadioButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}
const RadioButton = ({ onClick, isActive }: RadioButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames('switch-block__radio-button', {
        'switch-block__radio-button--checked': isActive,
        'switch-block__radio-button--unchecked': !isActive,
      })}
    />
  );
};

export default RadioButton;
