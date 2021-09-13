import React from 'react';
import ConfirmModal from 'Components/ConfirmModal';
import { CsvEmailError } from 'Interfaces/Document';

interface ValidationBulkSendModalProps {
  validationErrors: CsvEmailError[];
  onClose: () => void;
}

const ValidationBulkSendModal = ({
  validationErrors,
  onClose,
}: ValidationBulkSendModalProps) => {
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
          Uploaded CSV has validation errors.
        </h5>
        <h4 className="modal__title signTemplate__validation-modal-subTitle">
          If you want to send it, please check following emails:
        </h4>
        <ul className="signTemplate__error-list">
          {validationErrors.map((error, index) => (
            <li key={index} className="signTemplate__error-item">
              ‒ Row {error.index + 2}: {error.message}
            </li>
          ))}
        </ul>
      </div>
    </ConfirmModal>
  );
};

export default ValidationBulkSendModal;
