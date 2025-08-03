import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { Document, DocumentDownloadTypes, DocumentStatuses } from 'Interfaces/Document';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import IconDocument from 'Assets/images/icons/document-icon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import Avatar from 'Components/Avatar';
import IconEye from 'Assets/images/icons/eye-icon.svg';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import IconActivity from 'Assets/images/icons/activity-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import ActivityIcon from 'Assets/images/icons/activity-icon.svg';
import {
  SignatureRequestStatuseLabels,
  SignatureRequestStatuses,
} from 'Interfaces/SignatureRequest';
import SignatureRequestItemMobileView from './SignatureRequestItemMobileView';
import { useDocumentDownload } from 'Hooks/Document';
import DeleteModal from 'Components/DeleteModal';
import { useModal } from 'react-modal-hook';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import { useSigningUrlGet } from 'Hooks/DocumentSign';
import HistoryService from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SignatureRequestItemProps {
  document: Document;
  grid: any;
  className?: string;
  isSelected?: boolean;
  toggleSelect: () => void;
  onDeleteSignatureRequest: (documentId: Document['id']) => void;
  openMoveToFolderModal: () => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
}

const SignatureRequestItem = ({
  document,
  grid,
  className,
  isSelected,
  toggleSelect = () => {},
  onDeleteSignatureRequest,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
}: SignatureRequestItemProps) => {
  const isMobile = useIsMobile();
  const { id: userId }: User = useSelector(selectUser);
  const [downloadDocument] = useDocumentDownload();
  const [getSigningUrl] = useSigningUrlGet();

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

  const signDocument = useCallback(async () => {
    try {
      const response = await getSigningUrl({ documentId: document.id, userId: userId });
      if (!isNotEmpty(response)) {
        return Toast.error('Something went wrong. Please, try again.');
      }
      window.open(response.signingUrl, '_blank');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [document.id, getSigningUrl, userId]);

  const handleSignatureRequestDelete = useCallback(() => {
    onDeleteSignatureRequest(grid.entityId);
  }, [grid.entityId, onDeleteSignatureRequest]);

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleSignatureRequestDelete();
          hideDeleteModal();
        }}
        className={classNames('documents__deleteWrapper', { mobile: isMobile })}
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this signature request?
          </h5>
          <p className="modal__subTitle">
            Deleting this signature request will completely remove it. This cannot be
            undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleSignatureRequestDelete],
  );

  const handleDownload = useCallback(async () => {
    try {
      await downloadDocument({ documentId: document.id });
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [downloadDocument, document]);

  const handleMoveToClick = useCallback(() => {
    setSelectedEntitiesIds([grid.signatureRequests?.id]);
    openMoveToFolderModal();
  }, [grid.signatureRequests, openMoveToFolderModal, setSelectedEntitiesIds]);

  const options = useMemo(() => {
    const options = [
      {
        name: 'Preview',
        icon: IconEye,
        onClick: navigateToPreview,
        hidden: document.status !== DocumentStatuses.COMPLETED,
      },
      {
        name: 'Sign',
        icon: SignIcon,
        onClick: signDocument,
        hidden:
          ![DocumentStatuses.AWAITING, DocumentStatuses.DECLINED].includes(
            document.status,
          ) ||
          ![
            SignatureRequestStatuses.AWAITING_YOU,
            SignatureRequestStatuses.DECLINED,
          ].includes(grid.signatureRequests.status) ||
          (grid.signatureRequests.status === SignatureRequestStatuses.DECLINED &&
            document.isOrdered),
      },
      {
        name: 'Download',
        icon: DownloadIcon,
        onClick: handleDownload,
        hidden: document.status !== DocumentStatuses.COMPLETED,
      },
      {
        name: 'Move to',
        icon: IconFolder,
        onClick: handleMoveToClick,
      },
      {
        name: 'Activity',
        icon: IconActivity,
        onClick: () => navigateToPreview('document-activity'),
        hidden: document.status !== DocumentStatuses.COMPLETED,
      },
      {
        name: 'Delete',
        icon: DeleteIcon,
        onClick: showDeleteModal,
        className: 'documents__dropdownOption--red',
        classNameText: 'documents__dropdownOption--red',
        iconClassName: 'documents__dropdownOption--red-icon',
        classNameIcon: 'documents__dropdownOption--red-icon',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToPreview, document]);

  return isMobile ? (
    <SignatureRequestItemMobileView
      document={document}
      options={options}
      className={className}
      grid={grid}
    />
  ) : (
    <div
      className={classNames(
        'table__row',
        'table__dataRow document signature-request',
        className,
      )}
    >
      <div className="table__column table__column--check">
        <UICheckbox handleClick={toggleSelect} check={isSelected} />
      </div>
      <div className="table__column table__column--text--document signature-request">
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
        <div
          className={`documents__documentStatus documents__documentStatus--${grid.signatureRequests.status}`}
        >
          <span className="documents__documentStatus-text">
            {SignatureRequestStatuseLabels[grid.signatureRequests.status]}
          </span>
        </div>
      </div>
      <div className="table__column table__column--signature-request-date">
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
        {document.user.name ? formatDocumentName(document.user.name, 'document') : ''}
      </div>
    </div>
  );
};

export default SignatureRequestItem;
