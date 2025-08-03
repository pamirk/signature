import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import FirstStepIcon from 'Assets/images/icons/first-step-icon.svg';
import MiddleStepIcon from 'Assets/images/icons/middle-step-icon.svg';
import LastStepIcon from 'Assets/images/icons/finish-step-icon.svg';
import CheckCircle from 'Assets/images/icons/check-circle.svg';
import { SignActionLabel } from 'Interfaces/Document';

export interface ActionStepBarProps {
  onChoose: (step: number) => void;
  actionType?: SignActionLabel;
}

const ActionStepBar = ({ onChoose, actionType }: ActionStepBarProps) => {
  const handleStepChoose = useCallback(
    (step: number) => {
      onChoose(step);
    },
    [onChoose],
  );

  return (
    <div className="actionStepBar__container">
      <div className="actionStepBar__item" onClick={() => handleStepChoose(1)}>
        <ReactSVG src={FirstStepIcon} />

        <div className="actionStepBar__item--stepNumber first">1.</div>
        <div className="actionStepBar__item--text first">Upload the Files</div>
        <ReactSVG className="actionStepBar__item--checkIcon" src={CheckCircle} />
      </div>

      <div className="actionStepBar__item offset1" onClick={() => handleStepChoose(2)}>
        <ReactSVG src={MiddleStepIcon} />

        <div className="actionStepBar__item--stepNumber">2.</div>
        <div className="actionStepBar__item--text">Choose the Signers</div>
        <ReactSVG className="actionStepBar__item--checkIcon" src={CheckCircle} />
      </div>

      <div className="actionStepBar__item offset2" onClick={() => handleStepChoose(3)}>
        <ReactSVG src={MiddleStepIcon} />

        <div className="actionStepBar__item--stepNumber">3.</div>
        <div className="actionStepBar__item--text">{actionType}</div>
        <ReactSVG className="actionStepBar__item--checkIcon" src={CheckCircle} />
      </div>

      <div className="actionStepBar__item offset3" onClick={() => handleStepChoose(4)}>
        <ReactSVG src={LastStepIcon} />

        <div className="actionStepBar__item--stepNumber selected">4.</div>
        <div className="actionStepBar__item--text selected">Finish</div>
      </div>
    </div>
  );
};

export default ActionStepBar;
