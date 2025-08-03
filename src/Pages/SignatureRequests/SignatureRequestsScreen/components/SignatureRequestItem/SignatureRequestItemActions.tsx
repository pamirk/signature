import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useDownloadFiles, useModal } from 'Hooks/Common';
import { useDocumentDownload } from 'Hooks/Document';
import { Document, DocumentDownloadTypes, DocumentStatuses } from 'Interfaces/Document';
import Toast from 'Services/Toast';
import HistoryService from 'Services/History';

import IconEye from 'Assets/images/icons/eye-icon.svg';
import SignIcon from 'Assets/images/icons/sign-icon.svg';
import IconActivity from 'Assets/images/icons/activity-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import DeleteIcon from 'Assets/images/icons/remove-icon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';
import { useSigningUrlGet } from 'Hooks/DocumentSign';

import DropDownOptions from 'Components/DropDownOptions';
import { isNotEmpty } from 'Utils/functions';
import { SignatureRequestStatuses } from 'Interfaces/SignatureRequest';
import DocumentSeparatedFileKeyExtractor from 'Pages/Documents/DocumentSeparatedFileKeyExtractor';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SignatureRequestItemActionsProps {
  document: Document;
  grid: any;
  className?: string;
  onDeleteSignatureRequest: (documentId: Document['id']) => void;
  openMoveToFolderModal: () => void;
  setSelectedEntitiesIds: (entitiesIds) => void;
}

const SignatureRequestItemActions = ({
  document,
  grid,
  className,
  onDeleteSignatureRequest,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
}: SignatureRequestItemActionsProps) => {
  const [downloadDocument] = useDocumentDownload();
  const isMobile = useIsMobile();
  const { id: userId }: User = useSelector(selectUser);
  const [getSigningUrl] = useSigningUrlGet();

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
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
    [document],
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
  }, [document, getSigningUrl, userId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadDocument]);

  const handleSeparatedDocumentDownload = useCallback(async () => {
    try {
      if (document?.id && document.resultDocumentPdfFileKey) {
        await downloadSeparatedDocument([document]);
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [document, downloadSeparatedDocument]);

  const handleMoveToClick = useCallback(() => {
    setSelectedEntitiesIds([grid.signatureRequests?.id]);
    openMoveToFolderModal();
  }, [grid, openMoveToFolderModal, setSelectedEntitiesIds]);

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
        onClick:
          document.downloadType === DocumentDownloadTypes.MERGED
            ? handleDownload
            : handleSeparatedDocumentDownload,
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
        iconClassName: 'documents__dropdownOption--red-icon',
      },
    ];

    return options.filter(option => !option.hidden);
  }, [
    document.downloadType,
    document.status,
    grid.signatureRequests.status,
    handleDownload,
    handleMoveToClick,
    handleSeparatedDocumentDownload,
    navigateToPreview,
    showDeleteModal,
    signDocument,
  ]);

  return (
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

export default SignatureRequestItemActions;
