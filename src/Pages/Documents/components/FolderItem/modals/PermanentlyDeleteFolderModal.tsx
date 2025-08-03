import React, { useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import ConfirmModal from 'Components/ConfirmModal';
import { Folder } from 'Interfaces/Folder';
import { useFolderInfoGet } from 'Hooks/Folders';

interface PermanentlyDeleteFolderModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  folderId: Folder['id'];
}

const PermanentlyDeleteFolderModal = ({
  onConfirm,
  onCancel,
  folderId,
}: PermanentlyDeleteFolderModalProps) => {
  const [getFolderInfo] = useFolderInfoGet();

  useEffect(() => {
    getFolderInfo(folderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmModal
      onClose={onCancel}
      confirmComponent={() => (
        <UIButton priority="red" title="Yes, Delete" handleClick={onConfirm} />
      )}
      cancelComponent={() => (
        <div className="folders__deleteModal--cancel" onClick={onCancel}>
          Don&apos;t Delete
        </div>
      )}
      className="folders__deleteWrapper"
    >
      <div className="folders__deleteHeader">
        <h5 className="folders__deleteTitle">
          Are you sure want to permanently delete this folder?
        </h5>
        <p className="folders__deleteSubTitle">
          If you permanently delete this folder you won&apos;t be able to restore it.
        </p>
      </div>
    </ConfirmModal>
  );
};

export default PermanentlyDeleteFolderModal;
