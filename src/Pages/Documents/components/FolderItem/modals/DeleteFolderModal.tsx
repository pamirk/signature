import React, { useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import ConfirmModal from 'Components/ConfirmModal';
import { Folder, FolderTypes } from 'Interfaces/Folder';
import { useFolderInfoGet } from 'Hooks/Folders';
import { selectFolderInfo } from 'Utils/selectors';
import { useSelector } from 'react-redux';

const getItemsTypeByFolderType = {
  [FolderTypes.DOCUMENT]: 'documents',
  [FolderTypes.TEMPLATE]: 'templates',
  [FolderTypes.SIGNATURE_REQUEST]: 'signature requests',
};

interface DeleteFolderModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  folderId: Folder['id'];
  folderType?: Folder['type'];
}

const DeleteFolderModal = ({
  onConfirm,
  onCancel,
  folderId,
  folderType,
}: DeleteFolderModalProps) => {
  const [getFolderInfo] = useFolderInfoGet();
  const folderInfo = useSelector(state => selectFolderInfo(state, { folderId }));

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
        <h5 className="folders__deleteTitle">Are you sure want to delete this folder?</h5>
        <p className="folders__deleteSubTitle">
          It contains <b>{folderInfo && folderInfo.foldersCount} folders</b> and{' '}
          <b>
            {folderInfo && folderInfo.documentsCount}{' '}
            {folderType
              ? getItemsTypeByFolderType[folderType]
              : getItemsTypeByFolderType[FolderTypes.DOCUMENT]}
          </b>
          , if you delete this folder you will delete the folders and documents inside
        </p>
      </div>
    </ConfirmModal>
  );
};

export default DeleteFolderModal;
