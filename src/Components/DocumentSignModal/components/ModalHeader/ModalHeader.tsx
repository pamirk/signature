import React from 'react';
import { ReactSVG } from 'react-svg';

import CircleSuccessIcon from 'Assets/images/icons/circle-success.svg';

const ModalHeader = () => {
  return (
    <div className="successSignModal__header">
      <ReactSVG src={CircleSuccessIcon} className="successSendModal__main-icon" />
      <div className="successSendModal__text-wrapper">
        <p className="successSendModal__title">Thanks for sending your document</p>
        <p className="successSendModal__text">
          You&apos;ll receive a copy in your inbox shortly.
        </p>
      </div>
    </div>
  );
};

export default ModalHeader;
