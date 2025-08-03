import React, { useCallback } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface DeleteTeammateModalProps {
  onClose: () => void;
  onDeleteTeammate: () => void;
  isLoading?: boolean;
}

const DeleteTeammateModal = ({
  onClose,
  onDeleteTeammate,
  isLoading,
}: DeleteTeammateModalProps) => {
  const isMobile = useIsMobile();

  const handleSubmit = useCallback(async () => {
    await onDeleteTeammate();
    onClose();
  }, [onClose, onDeleteTeammate]);

  return (
    <UIModal onClose={onClose}>
      <div className={classNames('profile__modal', { mobile: isMobile })}>
        <div className="profile__modal-title">
          Are you sure you want to delete this team member?
        </div>
        <div className="profile__modal-description settings__text">
          If you want to remove the user so they can&apos;t access Signaturely anymore,
          please, continue. We must let you know that we will transfer to you from your
          teammate only completed documents and Live templates, and we will change these
          templates to drafts. We will delete everything else for everyone.
        </div>
        <div className="profile__modal-button-wrapper delete">
          <UIButton
            title="Don't delete team member"
            priority="primary"
            handleClick={onClose}
            disabled={isLoading}
            isLoading={isLoading}
          />
          <UIButton
            title="Delete team member anyway"
            priority="red"
            handleClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </UIModal>
  );
};

export default DeleteTeammateModal;
