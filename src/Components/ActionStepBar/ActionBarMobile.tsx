import React, { useCallback } from 'react';
import FirstStepIcon from 'Assets/images/icons/first-step-icon.svg';
import MiddleStepIcon from 'Assets/images/icons/middle-step-icon.svg';
import LastStepIcon from 'Assets/images/icons/finish-step-icon.svg';
import { ActionStepBarProps } from './ActionStepBar';

const ActionStepBarMobile = ({ onChoose }: ActionStepBarProps) => {
  const handleStepChoose = useCallback(
    (step: number) => {
      onChoose(step);
    },
    [onChoose],
  );

  return (
    <div className="actionStepBar__container mobile">
      <div className="actionStepBar__item mobile" onClick={() => handleStepChoose(1)}>
        <div className="actionStepBar__item--stepNumber mobile">Upload</div>
        <img src={FirstStepIcon} alt="" />
      </div>

      <div className="actionStepBar__item mobile" onClick={() => handleStepChoose(2)}>
        <div className="actionStepBar__item--stepNumber mobile">Action</div>
        <img src={MiddleStepIcon} alt="" />
      </div>

      <div className="actionStepBar__item mobile" onClick={() => handleStepChoose(3)}>
        <div className="actionStepBar__item--stepNumber mobile">Sign</div>
        <img src={MiddleStepIcon} alt="" />
      </div>

      <div className="actionStepBar__item mobile" onClick={() => handleStepChoose(4)}>
        <div className="actionStepBar__item--stepNumber selected mobile">Finish</div>
        <img src={LastStepIcon} alt="" />
      </div>
    </div>
  );
};

export default ActionStepBarMobile;
