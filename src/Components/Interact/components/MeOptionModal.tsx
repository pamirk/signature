import React from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';

export interface MeOptionModalProps {
  onClose: () => void;
}

function MeOptionModal({ onClose, ...modalProps }: MeOptionModalProps) {
  return (
    <UIModal onClose={onClose} {...modalProps}>
      <div className="confirmModal">
        <div className="confirmModal__content">
          Attention! You have chosen Me (Now) signer. All fields related to this signer
          have to be signed by you before document request sending.
        </div>
        <div className="confirmModal__buttons">
          <div className="confirmModal__button">
            <UIButton priority="primary" title="OK" handleClick={onClose} />
          </div>
        </div>
      </div>
    </UIModal>
  );
}

export default MeOptionModal;
