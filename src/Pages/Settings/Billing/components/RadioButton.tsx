import React from 'react';
import classNames from 'classnames';
interface RadioButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}
const RadioButton = ({ label, onClick, isActive }: RadioButtonProps) => {
  return (
    <div onClick={onClick} className="paymentSurveyModal__optionsWrapper">
      <div
        className={classNames('paymentSurveyModal__radio-button', {
          'paymentSurveyModal__radio-button--checked': isActive,
          'paymentSurveyModal__radio-button--unchecked': !isActive,
        })}
      />
      <div className="paymentSurveyModal__radio-label">{label}</div>
    </div>
  );
};
export default RadioButton;
