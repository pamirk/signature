import React from 'react';
import { ReactSVG } from 'react-svg';
import { RequisiteType } from 'Interfaces/Requisite';

import UISpinner from 'Components/UIComponents/UISpinner';

// @ts-ignore
import CloseIcon from 'Assets/images/icons/close-icon.svg';

interface RequisiteModalDrawProps {
  isDownloading: boolean;
  handleOnClearRequisite: (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    requisiteType: RequisiteType,
  ) => void;
  canvasSignRef: React.RefObject<HTMLCanvasElement>;
  canvasInitialsRef: React.RefObject<HTMLCanvasElement>;
}

export const RequisiteModalDraw = ({
  isDownloading,
  handleOnClearRequisite,
  canvasSignRef,
  canvasInitialsRef,
}: RequisiteModalDrawProps) => {
  return (
    <div>
      <p className="requisiteModal__type-select-title">Signature Preview:</p>
      <div className="requisiteModal__area-wrapper">
        <div className="requisiteModal__area-container">
          <p className="requisiteModal__area-subtitle">Full Name</p>
          <div className="requisiteModal__area requisiteModal__area--clear">
            {isDownloading && (
              <div className="requisiteModal__spinner">
                <UISpinner
                  width={50}
                  height={50}
                  wrapperClassName="spinner--main__wrapper"
                />
              </div>
            )}
            <canvas ref={canvasSignRef} className="requisiteModal__canvas" />
            <p
              className="requisiteModal__area-clear-text"
              onClick={() => handleOnClearRequisite(canvasSignRef, RequisiteType.SIGN)}
            >
              Clear
            </p>
          </div>
        </div>
        <div className="requisiteModal__area-container">
          <p className="requisiteModal__area-subtitle">Initials</p>
          <div className="requisiteModal__area requisiteModal__area--clear">
            {isDownloading && (
              <div className="requisiteModal__spinner">
                <UISpinner
                  width={50}
                  height={50}
                  wrapperClassName="spinner--main__wrapper"
                />
              </div>
            )}
            <canvas ref={canvasInitialsRef} className="requisiteModal__canvas" />
            <p
              className="requisiteModal__area-clear-text"
              onClick={() =>
                handleOnClearRequisite(canvasInitialsRef, RequisiteType.INITIAL)
              }
            >
              Clear
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisiteModalDraw;
