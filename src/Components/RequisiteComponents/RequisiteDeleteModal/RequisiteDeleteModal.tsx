import React, { useCallback, useMemo } from 'react';
import { capitalize } from 'lodash';
import { useRequisiteDelete } from 'Hooks/Requisite';
import { Requisite, RequisiteType } from 'Interfaces/Requisite';
import Toast from 'Services/Toast';

import ConfirmModal from 'Components/ConfirmModal';

interface RequisiteDeleteModalProps {
  requisiteItem: Requisite;
  closeModal: () => void;
}

export const RequisiteDeleteModal = ({
  closeModal,
  requisiteItem,
}: RequisiteDeleteModalProps) => {
  const [deleteRequisite, isDeleteLoading] = useRequisiteDelete();
  const requisiteTypeName = useMemo(
    () => (requisiteItem.type === RequisiteType.SIGN ? 'signature' : 'initials'),
    [requisiteItem.type],
  );
  const handleDeleteRequisite = useCallback(async () => {
    try {
      await deleteRequisite({ id: requisiteItem.id });
      closeModal();

      Toast.success(`${capitalize(requisiteTypeName)} deleted successfully`);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [requisiteItem.id, requisiteTypeName, deleteRequisite, closeModal]);

  return (
    <ConfirmModal
      onClose={closeModal}
      confirmButtonProps={{
        priority: 'red',
        className: 'confirmModal__button--delete',
        isLoading: isDeleteLoading,
        handleClick: handleDeleteRequisite,
        title: 'Delete',
      }}
      isCancellable={false}
    >
      <p className="settingsSignature__removeTitle">
        Are you sure you want to delete this {requisiteTypeName}?
      </p>
    </ConfirmModal>
  );
};

export default RequisiteDeleteModal;
