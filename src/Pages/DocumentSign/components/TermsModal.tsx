import React from 'react';
import ConfirmModal, { ConfirmModalProps } from 'Components/ConfirmModal';

interface TermsModalProps
  extends Pick<ConfirmModalProps, 'onConfirm' | 'onCancel' | 'onClose'> {
  documentName: string;
  isConfirmLoading: boolean;
}

const TermsModal = ({
  onConfirm,
  onCancel,
  onClose,
  documentName,
  isConfirmLoading,
}: TermsModalProps) => (
  <ConfirmModal
    className="termsModal-responsive"
    onClose={onClose}
    onCancel={onCancel}
    onConfirm={onConfirm}
    confirmText="I Agree"
    buttonsBlockClassName="termsModal__buttons-block"
    cancelComponent={() => (
      <div className="confirmModal__button termsModal__button-cancel" onClick={onClose}>
        Cancel
      </div>
    )}
    confirmButtonProps={{ isLoading: isConfirmLoading, disabled: isConfirmLoading }}
  >
    <div className="termsModal__wrapper">
      <div className="termsModal__title">Almost done!</div>
      <div className="termsModal__subtitle termsModal__text">
        You&apos;re about to submit your signature to the&nbsp;
        <span className="termsModal--bold">{documentName}</span>.
      </div>
      <div className="termsModal__description termsModal__text">
        By clicking <span className="termsModal--bold">&quot;I Agree&quot;</span> you
        agree to be legally bound to this document and the eSignature&nbsp;
        <a
          className="auth__link"
          href="https://signaturely.com/electronic-signature-disclosure-and-consent"
          target="_blank"
          rel="noopener noreferrer"
        >
          Disclosure and Consent Agreement
        </a>
        &nbsp;and&nbsp;
        <a
          className="auth__link"
          href="https://signaturely.com/terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Signaturely Terms & Conditions
        </a>
        .
      </div>
    </div>
  </ConfirmModal>
);

export default TermsModal;
