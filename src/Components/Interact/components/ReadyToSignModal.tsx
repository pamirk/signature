import React from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';

export interface ReadyToSignModalProps {
  onClose: () => void;
  onContinue: () => void;
  onSign: () => void;
}

function ReadyToSignModal({ onClose, onSign, onContinue }: ReadyToSignModalProps) {
  return (
    <UIModal onClose={onClose}>
      <div className="readyToSignModal__wrapper">
        <div className="readyToSignModal__header">
          <h3 className="readyToSignModal__title">Ready to sign your document?</h3>
        </div>
        <div className="readyToSignModal__subTitle">
          You&apos;re about to send a signature request to yourself via email.
          <br />
          Would you like to sign the document right here, right now?
        </div>
        <div className="readyToSignModal__buttons">
          <div className="readyToSignModal__button">
            <UIButton
              priority="primary"
              title="Sign Now"
              handleClick={onSign}
              className="readyToSignModal__button--sameSize"
            />
          </div>
        </div>
        <div className="readyToSignModal__buttons">
          <div className="readyToSignModal__button">
            <UIButton
              priority="primary"
              title="Send via Email"
              handleClick={onContinue}
              className="readyToSignModal__button--sameSize"
            />
          </div>
        </div>
      </div>
    </UIModal>
  );
}

export default ReadyToSignModal;
