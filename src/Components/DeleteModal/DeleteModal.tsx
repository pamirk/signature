import React from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { UIModalProps } from 'Components/UIComponents/interfaces/UIModal';
import ConfirmModal from 'Components/ConfirmModal';

interface DeleteModalProps extends UIModalProps {
  onClose: () => void;
  onConfirm: () => void;
  deleteTitle?: string;
  className?: string;
}

const DeleteModal = ({
  onClose,
  onConfirm,
  children,
  deleteTitle = 'Yes, Delete',
  ...modalProps
}: DeleteModalProps) => {
  return (
    <ConfirmModal
      onClose={onClose}
      confirmComponent={() => (
        <UIButton
          priority="red"
          handleClick={onConfirm}
          className="confirmModal__button--delete"
          title={deleteTitle}
        />
      )}
      isCancellable={false}
      isOverlayTransparent={true}
      {...modalProps}
    >
      {children}
    </ConfirmModal>
  );
};

export default DeleteModal;
