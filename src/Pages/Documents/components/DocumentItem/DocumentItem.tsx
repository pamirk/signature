import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useModal } from 'Hooks/Common';
import {
  useDocumentUpdate,
  useDocumentRevert,
  useDocumentToggleNotification,
} from 'Hooks/Document';
import { Document, DocumentStatuses, DocumentTypes } from 'Interfaces/Document';
import Toast from 'Services/Toast';
import HistoryService from 'Services/History';
import { formatDate, formatDocumentName } from 'Utils/formatters';

import UIModal from 'Components/UIComponents/UIModal';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import DropDownOptions from './DropDownOptions';
import { ShareModal, ReminderModal, SigningLinkModal } from './modals';
import EditableTitle from './EditableTitle';

import IconPencil from 'Assets/images/icons/pencil.svg';
import IconEye from 'Assets/images/icons/eye-icon.svg';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import IconShare from 'Assets/images/icons/share-icon.svg';
import IconDocWithPencil from 'Assets/images/icons/doc-pencil-icon.svg';
import IconActivity from 'Assets/images/icons/activity-icon.svg';
import KeyIcon from 'Assets/images/icons/key-icon.svg';
import CopyIcon from 'Assets/images/icons/copy-icon.svg';
import NotificationIcon from 'Assets/images/icons/notification-bell.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import ConfirmModal from 'Components/ConfirmModal';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserRoles } from 'Interfaces/User';
import DropDownSigners from './DropDownSigners';
import DocumentItemMobileView from './DocumentItemMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';

interface DocumentItemProps {
  document: Document;
  className?: string;
  isSelected?: boolean;
  toggleSelect: () => void;
  onDownload?: (id: Document['id']) => void;
  onDelete?: (id: Document['id']) => void;
}

const DocumentItem = ({
  document,
  className,
  isSelected,
  toggleSelect = () => {},
  onDownload,
  onDelete,
}: DocumentItemProps) => {
  const [isActiveEditForm, setIsEditFormActive] = useState<boolean>(false);
  const [updateDocument] = useDocumentUpdate();
  const [toggleDocumentNotification] = useDocumentToggleNotification();
  const [revertDocument, isReverting] = useDocumentRevert();
  const isMobile = useIsMobile();
  const { id: userId, role: userRole }: User = useSelector(selectUser);
  const remindableSigners = useMemo(
    () => document.signers.filter(signer => !signer.isPreparer),
    [document.signers],
  );

  const filteredSigners = document.signers.filter(signer => {
    if (!signer.isPreparer || document.type === DocumentTypes.ME) return signer;
  });

  const handleClickDocumentRename = useCallback(() => {
    setIsEditFormActive(true);
  }, []);

  const navigateToPreview = useCallback(
    (anchor?: string) => {
      HistoryService.push(
        [`/documents/${document.id}/preview`, !!anchor && `#${anchor}`]
          .filter(Boolean)
          .join(''),
      );
    },
    [document.id],
  );

  const [openShareModal, closeShareModal] = useModal(() => (
    <UIModal className="documents__shareModal" onClose={closeShareModal}>
      <ShareModal documentId={document.id} onSuccess={closeShareModal} />
    </UIModal>
  ));

  const [openReminderModal, closeReminderModal] = useModal(() => (
    <UIModal onClose={closeReminderModal} className="documents__reminderModal">
      <ReminderModal
        onClose={closeReminderModal}
        signersOptions={remindableSigners}
        documentId={document.id}
        isSignersOrdered={document.isOrdered}
      />
    </UIModal>
  ));

  const [openSigningLinkModal, closeSigningLinkModal] = useModal(
    () => (
      <SigningLinkModal
        documentId={document.id}
        signers={remindableSigners.filter(signer => !signer.isFinished)}
        onClose={closeSigningLinkModal}
        isSignersOrdered={document.isOrdered}
      />
    ),
    [document],
  );

  const navigateToDocumentEdit = useCallback(() => {
    HistoryService.push(`/documents/${document.id}/edit`);
  }, [document.id]);

  const handleDocumentRevert = useCallback(async () => {
    try {
      await revertDocument({ documentId: document.id });

      navigateToDocumentEdit();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [document.id, revertDocument, navigateToDocumentEdit]);

  const handleDelete = useCallback(() => {
    onDelete && onDelete(document.id);
  }, [document, onDelete]);

  const [openRevertModal, closeRevertModal] = useModal(
    () => (
      <ConfirmModal
        onClose={() => {
          if (!isReverting) closeRevertModal();
        }}
        onCancel={closeRevertModal}
        onConfirm={handleDocumentRevert}
        confirmText="Revert to Draft"
        confirmButtonProps={{
          disabled: isReverting,
          isLoading: isReverting,
        }}
        cancelButtonProps={{
          disabled: isReverting,
        }}
        className={classNames('documents__revertModal', { mobile: isMobile })}
        hideCloseIcon
      >
        <div className="modal__header">
          <h4 className="modal__title">Edit & Resend document</h4>
        </div>
        <p className="modal__subTitle modal__subTitle--center">
          The document would be reverted to draft first, you could edit and resend it
          then.
          <br />
          Are you sure you want to revert that document to draft?
        </p>
      </ConfirmModal>
    ),
    [isReverting],
  );

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDelete();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper mobile"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this document?
          </h5>
          <p className="modal__subTitle">
            Deleting this document will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDelete],
  );

  const handleEditAndResend = useCallback(() => {
    if (document.status === DocumentStatuses.DRAFT) {
      return navigateToDocumentEdit();
    }

    return openRevertModal();
  }, [navigateToDocumentEdit, openRevertModal, document.status]);

  const handleCopyCodeAccess = useCallback(async () => {
    try {
      if (document.codeAccess) {
        await navigator.clipboard.writeText(document.codeAccess);
        Toast.success('Copied to clipboard');
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [document.codeAccess]);

  const handleChangeNotificationStatus = useCallback(async () => {
    try {
      await toggleDocumentNotification({
        documentId: document.id,
      });
      Toast.success('Notifications were disabled');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [toggleDocumentNotification, document.id]);

  const handleDownload = useCallback(() => {
    onDownload && onDownload(document.id);
  }, [document, onDownload]);

  const isHiddenDocumentOwnerOption = useMemo(() => document.userId !== userId, [
    document.userId,
    userId,
  ]);

  const isHiddenTeamOption = useMemo(
    () =>
      document.userId !== userId &&
      userRole !== UserRoles.OWNER &&
      userRole !== UserRoles.ADMIN,
    [userRole, userId, document],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'Download',
        icon: DownloadIcon,
        onClick: handleDownload,
        hidden: !isMobile || document.status !== DocumentStatuses.COMPLETED,
      },
      {
        name: 'Rename',
        icon: IconPencil,
        onClick: handleClickDocumentRename,
        hidden: document.status !== DocumentStatuses.DRAFT || document.userId !== userId,
      },
      {
        name: 'Preview',
        icon: IconEye,
        onClick: navigateToPreview,
        hidden:
          !document.parts ||
          (!document.parts.every(part => part.filesUploaded) && !document.templateId) ||
          document.status === DocumentStatuses.DRAFT,
      },
      {
        name: 'Share',
        icon: IconShare,
        onClick: openShareModal,
        hidden: isHiddenDocumentOwnerOption,
      },
      {
        name: 'Edit & Resend',
        icon: IconDocWithPencil,
        onClick: handleEditAndResend,
        hidden:
          isHiddenDocumentOwnerOption || document.status === DocumentStatuses.COMPLETED,
      },
      {
        name: 'Send Reminder',
        icon: SignIcon,
        onClick: openReminderModal,
        hidden: [DocumentStatuses.COMPLETED, DocumentStatuses.DRAFT].includes(
          document.status,
        ),
      },
      {
        name: 'Activity',
        icon: IconActivity,
        onClick: () => navigateToPreview('document-activity'),
      },
      {
        name: 'Copy password',
        icon: KeyIcon,
        onClick: handleCopyCodeAccess,
        hidden: isHiddenDocumentOwnerOption || !document.codeAccess,
      },
      {
        name: 'Generate signing link',
        icon: CopyIcon,
        onClick: openSigningLinkModal,
        hidden: isHiddenTeamOption || document.status !== DocumentStatuses.AWAITING,
      },
      // {
      //   name: 'Disable reminders',
      //   icon: NotificationIcon,
      //   onClick: handleChangeNotificationStatus,
      //   hidden: document.status !== DocumentStatuses.AWAITING,
      // },
      {
        name: 'Delete',
        icon: DeleteIcon,
        onClick: showDeleteModal,
        hidden: !isMobile || document.status === DocumentStatuses.PREPARING,
        className: 'red',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigateToPreview,
    document,
    navigateToDocumentEdit,
    openReminderModal,
    handleClickDocumentRename,
  ]);

  const handleUpdateDocument = useCallback(
    async ({ title }) => {
      try {
        await updateDocument({
          values: { type: document.type, title, documentId: document.id },
        });
        Toast.success('Document successfully updated!');
        setIsEditFormActive(false);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [updateDocument, document.type, document.id],
  );

  return isMobile ? (
    <DocumentItemMobileView
      document={document}
      options={options}
      handleUpdateDocument={handleUpdateDocument}
      isActiveEditForm={isActiveEditForm}
      className={className}
    />
  ) : (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="table__column table__column--check">
        {document.status !== DocumentStatuses.PREPARING && !isHiddenTeamOption && (
          <UICheckbox handleClick={toggleSelect} check={isSelected} />
        )}
      </div>
      <div className="table__column table__column--text">
        {isActiveEditForm ? (
          <EditableTitle documentTitle={document.title} onSubmit={handleUpdateDocument} />
        ) : (
          formatDocumentName(document.title, 'document')
        )}
      </div>
      <div className="table__column table__column--date">
        {document.createdAt && formatDate(document.createdAt)}
      </div>
      <div className="table__column table__column--status">
        <div
          className={`documents__documentStatus documents__documentStatus--${document.status}`}
        >
          <span className="documents__documentStatus-text">
            {document.status === DocumentStatuses.PREPARING
              ? 'processing'
              : document.status}
          </span>
        </div>
      </div>
      <div className="table__column table__column--signer">
        {document.status !== (DocumentStatuses.PREPARING && DocumentStatuses.DRAFT) && (
          <DropDownSigners signers={filteredSigners} anchorClassName="table__container" />
        )}
      </div>
      <div className="table__column table__column--action">
        {document.status !== DocumentStatuses.PREPARING && (
          <DropDownOptions options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default DocumentItem;
