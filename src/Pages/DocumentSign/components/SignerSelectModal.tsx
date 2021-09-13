import React, { useState, useCallback } from 'react';
import ConfirmModal from 'Components/ConfirmModal';
import { SignerOption } from 'Interfaces/Document';
import SignerOptionItem from './SignerOptionItem';

interface ValidationModal {
  signerOptions: SignerOption[];
  onSignerSelect: (signer: SignerOption) => void;
  onClose: () => void;
}

const SignerSelectModal = ({
  signerOptions,
  onClose,
  onSignerSelect,
}: ValidationModal) => {
  const [selectedSigner, setSelectedSigner] = useState<SignerOption>();

  const handleConfirmSelection = useCallback(() => {
    selectedSigner && onSignerSelect(selectedSigner);
    onClose();
  }, [onClose, onSignerSelect, selectedSigner]);

  return (
    <ConfirmModal
      isCancellable={false}
      onClose={onClose}
      onConfirm={handleConfirmSelection}
      confirmButtonProps={{
        priority: 'primary',
        disabled: !selectedSigner,
        className: 'signerOptionModal__confirm',
        title: 'Select',
      }}
    >
      <div className="signTemplate__validation-modal">
        <h5 className="modal__title signTemplate__validation-modal-title">
          Signer selection
        </h5>
        <h4 className="modal__title signerOptionModal__subtitle">
          Your e-mail is attached to multiple signers, please choose one of them:
        </h4>
        <ul className="signerOptionModal__list">
          {signerOptions.map(signerOption => (
            <SignerOptionItem
              isSelected={signerOption.id === selectedSigner?.id}
              signerOption={signerOption}
              toggleSelect={() => setSelectedSigner(signerOption)}
              key={signerOption.id}
            />
          ))}
        </ul>
      </div>
    </ConfirmModal>
  );
};

export default SignerSelectModal;
