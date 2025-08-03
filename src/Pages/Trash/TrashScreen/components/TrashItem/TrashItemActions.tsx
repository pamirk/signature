import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useModal } from 'Hooks/Common';
import { Document, DocumentStatuses, DocumentTypes } from 'Interfaces/Document';

import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserRoles } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';
import TrashItemMobileView from './TrashItemMobileView';
import DropDownOptions from 'Pages/Documents/components/DocumentItem/DropDownOptions';

interface TrashItemActionsProps {
  document: Document;
  className?: string;
  onDelete?: (id: Document['id']) => void;
  onDeleteDocument: (documentId: Document['id'], permanently?: boolean) => void;
  onUpdateDocument: (title: string, documentId: string, type: DocumentTypes) => void;
  openMoveToFolderModal: () => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
  setRenamingDocumentId: (documentId: Document['id'] | undefined) => void;
}

const TrashItemActions = ({
  document,
  className,
  onDeleteDocument,
  onUpdateDocument,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  setRenamingDocumentId,
}: TrashItemActionsProps) => {
  const isMobile = useIsMobile();
  const { id: userId, role: userRole }: User = useSelector(selectUser);

  const handleDocumentDelete = useCallback(() => {
    onDeleteDocument(document.id, true);
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
        onClick: () => {
          showDeleteModal();
        },
        hidden: isHiddenDeleteButton,
        className: 'red',
        classNameText: 'documents__dropdownOption--red',
        classNameIcon: 'documents__dropdownOption--red-icon',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  const handleUpdateDocument = ({ title }) => {
    onUpdateDocument(title, document.id, document.type);
    setRenamingDocumentId(undefined);
  };

  return isMobile ? (
    <TrashItemMobileView
      document={document}
      options={options}
      handleUpdateDocument={handleUpdateDocument}
      isActiveEditForm={false}
      className={className}
    />
  ) : (
    <div
      className={classNames('table__row', 'table__dataRow document actions', className)}
    >
      <div className="table__column table__column--action document">
        {document.status !== DocumentStatuses.PREPARING && (
          <DropDownOptions options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default TrashItemActions;
