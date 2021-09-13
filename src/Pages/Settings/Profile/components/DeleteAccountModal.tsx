import React from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import { DeletionSteps } from 'Interfaces/Profile';
import UISpinner from 'Components/UIComponents/UISpinner';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleteAccount: () => void;
  isLoading?: boolean;
  step: DeletionSteps;
  nextStep: () => void;
}

const DeleteAccountModal = ({
  onClose,
  onDeleteAccount,
  step,
  nextStep,
  isLoading,
}: DeleteAccountModalProps) => {
  const isMobile = useIsMobile();
  return (
    <UIModal onClose={onClose}>
      {step === DeletionSteps.START_DELETION && (
        <div className={classNames('profile__modal', { mobile: isMobile })}>
          <div className="profile__modal-title">
            Are you sure you would like to delete your Signaturely account?
          </div>
          <div className="profile__modal-description settings__text">
            This action will erase all your documents, templates and past signatures.
            Would you like to proceed?
          </div>
          <div className="profile__modal-button-wrapper">
            <UIButton
              title="No, don’t delete my account"
              priority="primary"
              handleClick={onClose}
            />
          </div>
          <div className="profile__modal-button--delete" onClick={nextStep}>
            Yes, delete my account
          </div>
        </div>
      )}
      {step === DeletionSteps.DOWNGRADE_TO_FREE && (
        <div className={classNames('profile__modal', { mobile: isMobile })}>
          <div className="profile__modal-title">Want to close your account?</div>
          <div
            className={classNames(
              'profile__modal-description',
              'profile__modal-description--downgrade',
              'settings__text',
              { mobile: isMobile },
            )}
          >
            If you don’t plan on using Signaturely anymore, you can downgrade your account
            to the Free plan, and all your documents, templates and past signatures will
            remain.
          </div>
          <div
            className={classNames(
              'profile__modal-button-wrapper',
              'profile__modal-button-wrapper--group',
              { mobile: isMobile },
            )}
          >
            <div className="profile__modal-button">
              <UIButton
                title="No, don’t delete my account"
                priority="primary"
                handleClick={onClose}
              />
            </div>
            <UIButton
              title="Downgrade to free plan"
              priority="secondary"
              handleClick={onClose}
            />
          </div>
          <div className="profile__modal-button--delete" onClick={nextStep}>
            Delete my account
          </div>
        </div>
      )}
      {step === DeletionSteps.FINAL_DELETION && (
        <div className={classNames('profile__modal', { mobile: isMobile })}>
          <div className="profile__modal-title">
            Are you sure you would like to delete your Signaturely account?
          </div>
          <div className="profile__modal-description settings__text profile__modal-description--single">
            This action will erase all your documents, templates and past signatures.
            Would you like to proceed?
          </div>
          <div className="profile__modal-description settings__text">
            Once you cancel, you and your teammates paid plan will be automatically
            cancelled.
          </div>
          <div className="profile__modal-button-wrapper">
            <UIButton
              title="No, don’t delete my account"
              priority="primary"
              handleClick={onClose}
            />
          </div>
          {isLoading ? (
            <UISpinner width={30} height={30} wrapperClassName="spinner--main__wrapper" />
          ) : (
            <div className="profile__modal-button--delete" onClick={onDeleteAccount}>
              Yes, delete my account
            </div>
          )}
        </div>
      )}
    </UIModal>
  );
};

export default DeleteAccountModal;
