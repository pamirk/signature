import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useModal } from 'Hooks/Common';
import {
  Document,
  DocumentDownloadTypes,
  DocumentStatuses,
  DocumentTypes,
} from 'Interfaces/Document';
import { daysToDate, formatDocumentName } from 'Utils/formatters';

import UICheckbox from 'Components/UIComponents/UICheckbox';
import IconDocument from 'Assets/images/icons/document-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import ActivityIcon from 'Assets/images/icons/activity-icon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserRoles } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';
import Avatar from 'Components/Avatar';
import TrashItemMobileView from './TrashItemMobileView';

interface TrashItemProps {
  document: Document;
  className?: string;
  isSelected?: boolean;
  toggleSelect: () => void;
  onDelete?: (id: Document['id']) => void;
  onDeleteDocument: (documentId: Document['id']) => void;
  onUpdateDocument: (title: string, documentId: string, type: DocumentTypes) => void;
  openMoveToFolderModal: () => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
  setRenamingDocumentId: (documentId: Document['id'] | undefined) => void;
  isSetRenamingDocumentId: boolean;
}

const TrashItem = ({
  document,
  className,
  isSelected,
  toggleSelect = () => {},
  onDeleteDocument,
  onUpdateDocument,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  setRenamingDocumentId,
  isSetRenamingDocumentId,
}: TrashItemProps) => {
  const isMobile = useIsMobile();
  const { id: userId, role: userRole }: User = useSelector(selectUser);

  const handleDocumentDelete = useCallback(() => {
    onDeleteDocument(document.id);
  }, [document.id, onDeleteDocument]);

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDocumentDelete();
          hideDeleteModal();
        }}
        className={classNames('documents__deleteWrapper', { mobile: isMobile })}
        cancelTitle={"Don't Delete"}
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to permanently delete this document?
          </h5>
          <p className="modal__subTitle">
            If you permanently delete this folder you won&apos;t be able to restore it.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDocumentDelete],
  );

  const handleMoveToClick = useCallback(() => {
    setSelectedEntitiesIds([document.id]);
    openMoveToFolderModal();
  }, [document, openMoveToFolderModal, setSelectedEntitiesIds]);

  const isHiddenTeamOption = useMemo(
    () =>
      document.userId !== userId &&
      userRole !== UserRoles.OWNER &&
      userRole !== UserRoles.ADMIN,
    [userRole, userId, document],
  );

  const isHiddenDeleteButton = useMemo(
    () =>
      document.status === DocumentStatuses.PREPARING ||
      (userRole !== UserRoles.OWNER &&
        userRole !== UserRoles.ADMIN &&
        document?.userId !== userId),
    [document, userId, userRole],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'Move to',
        icon: IconFolder,
        onClick: handleMoveToClick,
        hidden:
          userRole !== UserRoles.OWNER &&
          userRole !== UserRoles.ADMIN &&
          document?.userId !== userId,
      },
      {
        name: 'Delete Permanently',
        icon: DeleteIcon,
        onClick: showDeleteModal,
        hidden: isHiddenDeleteButton,
        className: 'red',
        classNameText: 'documents__dropdownOption--red',
        classNameIcon: 'documents__dropdownOption--red-icon',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  const daysRemaining = useMemo(() => {
    if (document.deletedAt) {
      const deletedDate = new Date(Date.parse(document.deletedAt));
      deletedDate.setDate(deletedDate.getDate() + 30);
      const remainingDays = daysToDate(new Date(deletedDate).toDateString());
      return remainingDays && remainingDays > 0 ? remainingDays : 0;
    }
  }, [document.deletedAt]);

  const handleUpdateDocument = ({ title }) => {
    onUpdateDocument(title, document.id, document.type);
    setRenamingDocumentId(undefined);
  };

  return isMobile ? (
    <TrashItemMobileView
      document={document}
      options={options}
      handleUpdateDocument={handleUpdateDocument}
      isActiveEditForm={isSetRenamingDocumentId}
      className={className}
    />
  ) : (
    <div className={classNames('table__row', 'table__dataRow document', className)}>
      <div className="table__column table__column--check">
        {!isHiddenTeamOption && (
          <UICheckbox handleClick={toggleSelect} check={isSelected} />
        )}
      </div>
      <div className="table__column table__column--text--document">
        {document.downloadType === DocumentDownloadTypes.SEPARATED ? (
          <>
            <img
              src={IconDocument}
              className="documents__dropdownOption-icon separated"
              title="Document with independent audit trail"
              alt=""
            />
            <img
              src={ActivityIcon}
              className="documents__dropdownOption-icon"
              title="Document with independent audit trail"
              alt=""
            />
          </>
        ) : (
          <img
            src={IconDocument}
            className="documents__dropdownOption-icon merged"
            title="Document with dependent audit trail"
            alt=""
          />
        )}
        <p className="table__column table__column--text--document truncated">
          {formatDocumentName(document.title, 'document')}
        </p>
        <div className={`documents__documentStatus documents__documentStatus--deleted`}>
          <span className="documents__documentStatus-text">DELETED</span>
        </div>
      </div>
      <div className="table__column table__column--date document">
        {daysRemaining &&
          `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`}
      </div>
      <div className="table__column table__column--created-by">
        <span>
          <Avatar
            name={document.user.name}
            email={document.user.email}
            avatarUrl={document.user.avatarUrl}
          />
        </span>
        <p
          className="table__column--created-by--span"
          title={
            document.user.name && document.user.name.length > 30
              ? formatDocumentName(document.user.name, 'document')
              : ''
          }
        >
          {document.user.name ? formatDocumentName(document.user.name, 'document') : ''}
        </p>
      </div>
    </div>
  );
};

export default TrashItem;
