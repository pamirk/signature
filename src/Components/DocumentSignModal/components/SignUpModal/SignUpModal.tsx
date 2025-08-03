import React, { useCallback, useEffect, useMemo } from 'react';
import Toast from 'Services/Toast';
import { Document } from 'Interfaces/Document';
import {
  useDocumentConvertionStatusWatcher,
  useDocumentSignPrint,
} from 'Hooks/DocumentSign';
import { useDocumentDownload } from 'Hooks/Document';

import UIModal from 'Components/UIComponents/UIModal';
import { PreviewDocumentSide, SignUpSide } from './components';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface SignUpModalProps {
  document: Document;
  onClose: () => void;
  onSignInClick: () => void;
}

const SignUpModal = ({ document, onClose, onSignInClick }: SignUpModalProps) => {
  const [
    watchDocumentConvertionStatus,
    watchDocumentConvertionStatusCancel,
    isWatcherExecuting,
  ] = useDocumentConvertionStatusWatcher();
  const isMobile = useIsMobile();

  const signer = useMemo(() => document?.signers[0], [document]);
  const [printPdf, isPdfLoading] = useDocumentSignPrint(document as Document);
  const [
    downloadDocument,
    isDownloadingDocument,
    isDownloadReady,
  ] = useDocumentDownload();

  const handleWatchDocumentConvertionStatus = useCallback(async () => {
    if (signer)
      await watchDocumentConvertionStatus({
        signerId: signer.id,
      });
  }, [signer, watchDocumentConvertionStatus]);

  useEffect(() => {
    handleWatchDocumentConvertionStatus();
    return () => watchDocumentConvertionStatusCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDocumentConvertionStatusCancel]);

  const handleDocumentDownload = useCallback(async () => {
    try {
      await downloadDocument({
        documentId: document.id,
        signerId: signer?.id,
      });
    } catch (error) {
      Toast.handleErrors(error, { toastId: 'download_error' });
    }
  }, [document.id, downloadDocument, signer]);

  return (
    <UIModal
      onClose={onClose}
      overlayClassName="successSignUpModal__overlay"
      className="successSignUpModal"
    >
      <div className={classNames('successSignUpModal__wrapper', { mobile: isMobile })}>
        <PreviewDocumentSide
          isWatcherExecuting={isWatcherExecuting}
          onClickDownload={handleDocumentDownload}
          onClickPrint={() =>
            printPdf({
              documentId: document.id,
              signerId: signer?.id,
            })
          }
          isDownloading={isDownloadingDocument || !isDownloadReady}
          isPdfLoading={isPdfLoading}
        />
        <SignUpSide onClose={onClose} onSignInClick={onSignInClick} />
      </div>
    </UIModal>
  );
};

export default SignUpModal;
