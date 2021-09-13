import React from 'react';
import { ReactSVG } from 'react-svg';
import { useDocumentFieldHistory } from 'Hooks/DocumentFields';

import UIButton from 'Components/UIComponents/UIButton';
import ScaleDropDown from './ScaleDropDown';

import NavigateIconLeft from 'Assets/images/icons/navigate-icon-left.svg';
import NavigateIconRight from 'Assets/images/icons/navigate-icon-right.svg';
import CopyIcon from 'Assets/images/icons/copy-icon.svg';
import PasteIcon from 'Assets/images/icons/paste-icon.svg';
import { DocumentActions } from 'Components/DocumentForm/DocumentForm';

export interface ModalHeaderProps {
  onScaleChange: (number:any) => void;
  handleSubmit: () => void;
  handleClose: () => void;
  documentScale: number;
  isSubmitting?: boolean;
  onCopy?: () => void;
  onPaste?: () => void;
  submitButtonTitle?: DocumentActions;
  isForm?: boolean;
}

function ModalHeader({
  handleClose,
  onScaleChange,
  documentScale,
  handleSubmit,
  isSubmitting = false,
  onCopy,
  onPaste,
  submitButtonTitle = DocumentActions.SEND,
  isForm,
}: ModalHeaderProps) {
  const [
    redoDocumentFieldAction,
    undoDocumentFieldAction,
    isNextAvailable,
    isPrevAvailable,
  ] = useDocumentFieldHistory();

  return (
    <header className="interactModal__header">
      <h3 className="interactModal__header-title">
        {isForm ? 'Preparing Form' : 'Prepare for Signing'}
      </h3>
      <div className="interactModal__header-bar">
        <div className="interactModal__header-navigate">
          <button
            onClick={undoDocumentFieldAction}
            disabled={!isPrevAvailable}
            className="interactModal__header-bar-button interactModal__header-navigate-button"
          >
            <ReactSVG
              src={NavigateIconLeft}
              className="interactModal__header-bar-button-icon"
            />
            Prev
          </button>
          <button
            onClick={redoDocumentFieldAction}
            disabled={!isNextAvailable}
            className="interactModal__header-bar-button interactModal__header-navigate-button  interactModal__header-navigate-button--next"
          >
            <ReactSVG
              src={NavigateIconRight}
              className="interactModal__header-bar-button-icon"
            />
            Next
          </button>
        </div>
        <div className="interactModal__header-copyPast">
          <button className="interactModal__header-bar-button" onClick={onCopy}>
            <ReactSVG src={CopyIcon} className="interactModal__header-bar-button-icon" />
            Copy
          </button>
          <button className="interactModal__header-bar-button" onClick={onPaste}>
            <ReactSVG src={PasteIcon} className="interactModal__header-bar-button-icon" />
            Paste
          </button>
          <ScaleDropDown changeScale={onScaleChange} documentScale={documentScale} />
        </div>
      </div>
      <div className="interactModal__header-send">
        <button className="interactModal__header-cancelButton" onClick={handleClose}>
          Cancel
        </button>
        <UIButton
          priority="primary"
          title={submitButtonTitle}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          handleClick={handleSubmit}
        />
      </div>
    </header>
  );
}

export default ModalHeader;
