import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useModal, useDownloadFiles } from 'Hooks/Common';
import {
  useDocumentDownload,
  useDocumentRevert,
  useDocumentToggleNotification,
} from 'Hooks/Document';
import {
  Document,
  DocumentDownloadTypes,
  DocumentStatuses,
  DocumentTypes,
} from 'Interfaces/Document';
import Toast from 'Services/Toast';
import HistoryService from 'Services/History';
import { formatDate, formatDocumentName } from 'Utils/formatters';

import UIModal from 'Components/UIComponents/UIModal';
import UICheckbox from 'Components/UIComponents/UICheckbox';
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
import IconDocument from 'Assets/images/icons/document-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import ActivityIcon from 'Assets/images/icons/activity-icon.svg';
import ConfirmModal from 'Components/ConfirmModal';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserRoles } from 'Interfaces/User';
import DropDownSigners from './DropDownSigners';
import DocumentItemMobileView from './DocumentItemMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';
import NotificationIcon from 'Assets/images/icons/notification-bell.svg';
import Avatar from 'Components/Avatar';
import DocumentSeparatedFileKeyExtractor from 'Pages/Documents/DocumentSeparatedFileKeyExtractor';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface DocumentItemProps {
  document: Document;
  grid: any;
  className?: string;
  isSelected?: boolean;
  toggleSelect: () => void;
  onDownload?: (id: Document['id']) => void;
  onDelete?: (id: Document['id']) => void;
  onDeleteDocument: (documentId: Document['id']) => void;
  onUpdateDocument: (title: string, documentId: string, type: DocumentTypes) => void;
  openMoveToFolderModal: () => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
  setRenamingDocumentId: (documentId: Document['id'] | undefined) => void;
  isSetRenamingDocumentId: boolean;
}

const DocumentItem = ({
  document,
  grid,
  className,
  isSelected,
  toggleSelect = () => {},
  onDeleteDocument,
  onUpdateDocument,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  setRenamingDocumentId,
  isSetRenamingDocumentId,
}: DocumentItemProps) => {
  const [toggleDocumentNotification] = useDocumentToggleNotification();
  const [revertDocument, isReverting] = useDocumentRevert();
  const [downloadDocument] = useDocumentDownload();
  const [
    ,
    documentSeparatedFileKeyExtractorForDocument,
    documentSeparatedFileKeyExtractorForDocumentActivities,
  ] = DocumentSeparatedFileKeyExtractor();

  const [downloadSeparatedDocument] = useDownloadFiles<Document>({
    fileExtractors: [
      documentSeparatedFileKeyExtractorForDocument,
      documentSeparatedFileKeyExtractorForDocumentActivities,
    ],
    name: `${document.title}`,
  });
  const isMobile = useIsMobile();
  const { id: userId, role: userRole }: User = useSelector(selectUser);
  const remindableSigners = useMemo(
    () => (document.signers ? document.signers.filter(signer => !signer.isPreparer) : []),
    [document],
  );

  const filteredSigners = document.signers
    ? document.signers.filter(signer => {
        return !signer.isPreparer || document.type === DocumentTypes.ME;
      })
    : [];

  const handleClickDocumentRename = useCallback(() => {
    setRenamingDocumentId(document.id);
  }, [document.id, setRenamingDocumentId]);

  const navigateToPreview = useCallback(
    (anchor?: string) => {
      HistoryService.push(
        [
          `${AuthorizedRoutePaths.DOCUMENTS}/${document.id}/preview`,
          !!anchor && `#${anchor}`,
        ]
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
        signers={
          document.isOrdered
            ? remindableSigners.filter(signer => !signer.isFinished && !signer.isDeclined)
            : remindableSigners.filter(signer => !signer.isFinished)
        }
        onClose={closeSigningLinkModal}
        isSignersOrdered={document.isOrdered}
      />
    ),
    [document],
  );

  const navigateToDocumentEdit = useCallback(() => {
    HistoryService.push(`${AuthorizedRoutePaths.DOCUMENTS}/${document.id}/edit`);
  }, [document.id]);

  const handleDocumentRevert = useCallback(async () => {
    try {
      await revertDocument({ documentId: document.id });

      navigateToDocumentEdit();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [document.id, revertDocument, navigateToDocumentEdit]);

  const handleDocumentDelete = useCallback(() => {
    onDeleteDocument(document.id);
  }, [document.id, onDeleteDocument]);

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

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDocumentDelete();
          hideDeleteModal();
        }}
        className={classNames('documents__deleteWrapper', { mobile: isMobile })}
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this document?
          </h5>
          <p className="modal__subTitle">
            Deleting this document will move it to the trash, and you can restore files
            there.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDocumentDelete],
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
        grid,
        disableReminders: !document.disableReminders,
      });
      Toast.success(
        `Notifications were ${document.disableReminders ? 'enabled' : 'disabled'}`,
      );
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [toggleDocumentNotification, grid, document.disableReminders]);

  const handleDownload = useCallback(async () => {
    try {
      await downloadDocument({ documentId: document.id });
    } catch (err) {
      Toast.handleErrors(err, { toastId: 'download_error' });
    }
  }, [downloadDocument, document]);

  const handleSeparatedDocumentDownload = useCallback(async () => {
    try {
      if (document?.id && document.resultDocumentPdfFileKey) {
        await downloadSeparatedDocument([document]);
      }
    } catch (err) {
      Toast.handleErrors(err, { toastId: 'separated_download_error' });
    }
  }, [document, downloadSeparatedDocument]);

  const handleMoveToClick = useCallback(() => {
    setSelectedEntitiesIds([document.id]);
    openMoveToFolderModal();
  }, [document, openMoveToFolderModal, setSelectedEntitiesIds]);

  const isHiddenDocumentOwnerOption = useMemo(
    () => document.userId !== userId && userRole === UserRoles.USER,
    [document.userId, userId, userRole],
  );

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

  const isHiddenDeclinedDocumentOption = useMemo(
    () => document.status === DocumentStatuses.DECLINED && document.isOrdered,
    [document.isOrdered, document.status],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'Download',
        icon: DownloadIcon,
        onClick:
          document.downloadType === DocumentDownloadTypes.MERGED
            ? handleDownload
            : handleSeparatedDocumentDownload,
        hidden: document.status !== DocumentStatuses.COMPLETED,
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
        name: 'Move to',
        icon: IconFolder,
        onClick: handleMoveToClick,
        hidden:
          userRole !== UserRoles.OWNER &&
          userRole !== UserRoles.ADMIN &&
          document?.userId !== userId,
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
          document.userId !== userId || document.status === DocumentStatuses.COMPLETED,
      },
      {
        name: 'Send Reminder',
        icon: SignIcon,
        onClick: openReminderModal,
        hidden:
          isHiddenDeclinedDocumentOption ||
          [
            DocumentStatuses.COMPLETED,
            DocumentStatuses.DRAFT,
            DocumentStatuses.EXPIRED,
          ].includes(document.status),
      },
      {
        name: 'Activity',
        icon: IconActivity,
        onClick: () => navigateToPreview('document-activity'),
      },
      {
        name: 'Copy Access Code',
        icon: KeyIcon,
        onClick: handleCopyCodeAccess,
        hidden: isHiddenDocumentOwnerOption || !document.codeAccess,
      },
      {
        name: 'Generate signing link',
        icon: CopyIcon,
        onClick: openSigningLinkModal,
        hidden:
          isHiddenTeamOption ||
          isHiddenDeclinedDocumentOption ||
          ![DocumentStatuses.AWAITING, DocumentStatuses.DECLINED].includes(
            document.status,
          ),
      },
      {
        name: document.disableReminders ? 'Enable reminders' : 'Disable reminders',
        icon: NotificationIcon,
        onClick: handleChangeNotificationStatus,
        hidden: document.status !== DocumentStatuses.AWAITING,
      },
      {
        name: 'Delete',
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
  }, [
    navigateToPreview,
    document,
    navigateToDocumentEdit,
    openReminderModal,
    handleClickDocumentRename,
  ]);

  const handleUpdateDocument = ({ title }) => {
    onUpdateDocument(title, document.id, document.type);
    setRenamingDocumentId(undefined);
  };

  return isMobile ? (
    <DocumentItemMobileView
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
        {isSetRenamingDocumentId ? (
          <EditableTitle documentTitle={document.title} onSubmit={handleUpdateDocument} />
        ) : (
          <p className="table__column table__column--text--document truncated">
            {formatDocumentName(document.title, 'document')}
          </p>
        )}
        {document.deletedAt ? (
          <div className={`documents__documentStatus documents__documentStatus--deleted`}>
            <span className="documents__documentStatus-text">DELETED</span>
          </div>
        ) : (
          <div
            className={`documents__documentStatus documents__documentStatus--${document.status}`}
          >
            <span className="documents__documentStatus-text">
              {document.status === DocumentStatuses.PREPARING
                ? 'processing'
                : document.status}
            </span>
          </div>
        )}
      </div>
      <div className="table__column table__column--date document">
        {document.createdAt && formatDate(document.createdAt)}
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
      <div className="table__column table__column--signer">
        {document.status !== (DocumentStatuses.PREPARING && DocumentStatuses.DRAFT) && (
          <DropDownSigners signers={filteredSigners} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default DocumentItem;
