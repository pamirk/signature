import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { daysToDate, formatDate, formatFolderName } from 'Utils/formatters';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import IconPencil from 'Assets/images/icons/pencil.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import LockIcon from 'Assets/images/icons/lock.svg';
import { ReactSVG } from 'react-svg';
import EditableTitle from '../DocumentItem/EditableTitle';
import { useModal } from 'Hooks/Common';
import DeleteFolderModal from './modals/DeleteFolderModal';
import { Folder, FolderTypes } from 'Interfaces/Folder';
import { GridItem } from 'Interfaces/Grid';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { UserRoles, User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { FolderItemMobileView } from './FolderItemMobileView';
import Avatar from 'Components/Avatar';
import PermanentlyDeleteFolderModal from './modals/PermanentlyDeleteFolderModal';

interface FolderItemProps {
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
  isSetRenamingFolderId: boolean;
}

const FolderItem = ({
  folder,
  grid,
  toggleSelect,
  isSelected,
  onUpdateFolder,
  onDeleteFolder,
  openChangePermissionsModal,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  handleOpenFolder,
  setRenamingFolderId,
  isSetRenamingFolderId,
}: FolderItemProps) => {
  const user: User = useSelector(selectUser);
  const isMobile = useIsMobile();
  const isNotSignatureRequestFolder = useMemo(
    () => folder.type !== FolderTypes.SIGNATURE_REQUEST,
    [folder.type],
  );

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

  const daysRemaining = useMemo(() => {
    if (folder.deletedAt) {
      const deletedDate = new Date(Date.parse(folder.deletedAt));
      deletedDate.setDate(deletedDate.getDate() + 30);
      return daysToDate(new Date(deletedDate).toDateString());
    }
  }, [folder.deletedAt]);

  const handleUpdateFolder = ({ title }) => {
    onUpdateFolder(title, folder?.id);
    setRenamingFolderId(undefined);
  };

  return isMobile ? (
    <FolderItemMobileView
      folder={folder}
      grid={grid}
      isActiveEditForm={isSetRenamingFolderId}
      handleOpenFolder={handleOpenFolder}
      handleUpdateFolder={handleUpdateFolder}
      options={options}
    />
  ) : (
    <div
      className={classNames('table__row', 'table__dataRow document', {
        template:
          folder.type &&
          [FolderTypes.TEMPLATE, FolderTypes.SIGNATURE_REQUEST].includes(folder.type),
      })}
    >
      <div className="table__column table__column--check">
        <UICheckbox handleClick={toggleSelect} check={isSelected} />
      </div>
      <div
        className={classNames(
          'table__column table__column--text--document',
          { folder: !isSetRenamingFolderId },
          {
            template:
              folder.type &&
              [FolderTypes.TEMPLATE, FolderTypes.SIGNATURE_REQUEST].includes(folder.type),
          },
        )}
        onDoubleClick={() =>
          handleOpenFolder({
            title: folder.title,
            id: folder.id,
            permissions: grid.permissions,
          })
        }
      >
        <ReactSVG src={IconFolder} className="documents__dropdownOption-icon merged" />
        {isSetRenamingFolderId ? (
          <EditableTitle
            documentTitle={folder?.title || ''}
            onSubmit={handleUpdateFolder}
          />
        ) : (
          <p className="table__column table__column--text--document truncated">
            {formatFolderName(folder?.title || '')}
          </p>
        )}
      </div>
      {!folder.deletedAt ? (
        <div className="table__column table__column--date document">
          {isNotSignatureRequestFolder &&
            folder?.createdAt &&
            formatDate(folder.createdAt)}
        </div>
      ) : (
        <div className="table__column table__column--date document">
          {daysRemaining &&
            `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`}
        </div>
      )}

      <div className="table__column table__column--created-by">
        {isNotSignatureRequestFolder && (
          <span>
            <Avatar
              name={folder.user.name}
              email={folder.user.email}
              avatarUrl={folder.user.avatarUrl}
            />
          </span>
        )}
        {isNotSignatureRequestFolder && folder.user.name
          ? formatFolderName(folder.user.name || '')
          : ''}
      </div>
      {folder.type === FolderTypes.DOCUMENT ? (
        <div className="table__column table__column--signer" />
      ) : null}
    </div>
  );
};

export default FolderItem;
