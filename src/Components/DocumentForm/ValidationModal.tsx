import React from 'react';
import ConfirmModal from 'Components/ConfirmModal';

interface ValidationModal {
  validationErrors: string[];
  onClose: () => void;
  headerText?: string;
  description?: string;
}

const ValidationModal = ({
  validationErrors,
  onClose,
  headerText = 'Document saved.',
  description,
}: ValidationModal) => {
  return (
    <ConfirmModal
      isCancellable={false}
      onClose={onClose}
      onConfirm={onClose}
      confirmButtonProps={{
        priority: 'primary',
        className: 'signTemplate__validation-modal-confirm',
      }}
    >
      <div className="signTemplate__validation-modal">
        <h5 className="modal__title signTemplate__validation-modal-title">
          {headerText}
        </h5>
        <h4 className="modal__title signTemplate__validation-modal-subTitle">
          {description ||
            'If you want to send it, please ensure the document meets the requirements below'}
        </h4>
        <ul className="signTemplate__error-list">
          {validationErrors.map((error, index) => (
            <li key={index} className="signTemplate__error-item">
              ‒ {error}
            </li>
          ))}
        </ul>
      </div>
    </ConfirmModal>
  );
};

export default ValidationModal;
