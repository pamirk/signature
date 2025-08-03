import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import DropDownOptions from '../DocumentItem/DropDownOptions';
import IconPencil from 'Assets/images/icons/pencil.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import LockIcon from 'Assets/images/icons/lock.svg';
import { useModal } from 'Hooks/Common';
import DeleteFolderModal from './modals/DeleteFolderModal';
import { Folder, FolderTypes } from 'Interfaces/Folder';
import { GridItem } from 'Interfaces/Grid';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { UserRoles, User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { FolderItemMobileView } from './FolderItemMobileView';
import PermanentlyDeleteFolderModal from './modals/PermanentlyDeleteFolderModal';

interface FolderItemActionsProps {
  folder: Folder;
  grid: GridItem;
  toggleSelect: () => void;
  isSelected?: boolean;
  onUpdateFolder: (title, folderId) => void;
  onDeleteFolder: (folderId: Folder['id'], permanently?: boolean) => void;
  openChangePermissionsModal: (folder?: GridItem) => void;
  openMoveToFolderModal: (showWarning?: boolean) => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
  handleOpenFolder: ({ title, id, permissions }) => void;
  setRenamingFolderId: (folderId: Folder['id'] | undefined) => void;
}

const FolderItemActions = ({
  folder,
  grid,
  onUpdateFolder,
  onDeleteFolder,
  openChangePermissionsModal,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  handleOpenFolder,
  setRenamingFolderId,
}: FolderItemActionsProps) => {
  const user: User = useSelector(selectUser);
  const isMobile = useIsMobile();

  const [showDeleteModal, hideDeleteModal] = useModal(
    () =>
      !folder.deletedAt ? (
        <DeleteFolderModal
          onConfirm={() => {
            onDeleteFolder(folder?.id || '');
            hideDeleteModal();
          }}
          onCancel={hideDeleteModal}
          folderId={folder?.id || ''}
          folderType={folder.type}
        />
      ) : (
        <PermanentlyDeleteFolderModal
          onConfirm={() => {
            onDeleteFolder(folder?.id || '', !!folder?.deletedAt);
            hideDeleteModal();
          }}
          onCancel={hideDeleteModal}
          folderId={folder?.id || ''}
        />
      ),
    [],
  );

  const handleClickFolderRename = useCallback(() => {
    setRenamingFolderId(folder.id);
  }, [folder.id, setRenamingFolderId]);

  const handleMoveToClick = useCallback(() => {
    setSelectedEntitiesIds([folder?.id]);
    openMoveToFolderModal(true);
  }, [folder, openMoveToFolderModal, setSelectedEntitiesIds]);

  const handleUpdatePermissionsClick = useCallback(() => {
    openChangePermissionsModal(grid);
  }, [grid, openChangePermissionsModal]);

  const options = useMemo(() => {
    const options = [
      {
        name: 'Rename',
        icon: IconPencil,
        onClick: handleClickFolderRename,
        hidden:
          (user.role !== UserRoles.OWNER &&
            user.role !== UserRoles.ADMIN &&
            folder?.userId !== user.id) ||
          folder.deletedAt,
      },
      {
        name: 'Change Permissions',
        icon: LockIcon,
        onClick: handleUpdatePermissionsClick,
        hidden:
          (user.role !== UserRoles.OWNER &&
            user.role !== UserRoles.ADMIN &&
            folder?.userId !== user.id) ||
          folder?.type === FolderTypes.SIGNATURE_REQUEST ||
          folder.deletedAt,
      },
      {
        name: 'Move to',
        icon: IconFolder,
        onClick: handleMoveToClick,
        hidden:
          user.role !== UserRoles.OWNER &&
          user.role !== UserRoles.ADMIN &&
          folder?.userId !== user.id,
      },
      {
        name: !folder.deletedAt ? 'Delete' : 'Delete Permanently',
        icon: IconRemove,
        onClick: showDeleteModal,
        hidden:
          user.role !== UserRoles.OWNER &&
          user.role !== UserRoles.ADMIN &&
          folder?.userId !== user.id,
        classNameText: 'documents__dropdownOption--red',
        classNameIcon: 'documents__dropdownOption--red-icon',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateFolder = ({ title }) => {
    onUpdateFolder(title, folder?.id);
    setRenamingFolderId(undefined);
  };

  return isMobile ? (
    <FolderItemMobileView
      folder={folder}
      grid={grid}
      isActiveEditForm={false}
      handleOpenFolder={handleOpenFolder}
      handleUpdateFolder={handleUpdateFolder}
      options={options}
    />
  ) : (
    <div className={classNames('table__row', 'table__dataRow document actions')}>
      <div className="table__column table__column--action document">
        {!!options.length && (
          <DropDownOptions options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default FolderItemActions;
