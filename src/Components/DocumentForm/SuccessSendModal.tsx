import React, { useCallback, useEffect, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import { capitalize } from 'lodash';
import classNames from 'classnames';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { useDocumentDownload } from 'Hooks/Document';
import {
  useDocumentConvertionStatusWatcher,
  useDocumentSignPrint,
} from 'Hooks/DocumentSign';
import { Document, DocumentTypes } from 'Interfaces/Document';

import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';

import CircleSuccessIcon from 'Assets/images/icons/circle-success.svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import PrintIcon from 'Assets/images/icons/print-icon.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SuccessSendModalProps {
  onClose?: () => void;
  document: Document;
  onConfirm?: () => void;
  isTemplate?: boolean;
  isDisableActionPanel?: boolean;
}

const SuccessSendModal = ({
  onClose,
  document,
  onConfirm,
  isTemplate,
  isDisableActionPanel,
}: SuccessSendModalProps) => {
  const [printPdf, isPdfLoading] = useDocumentSignPrint(document);
  const [
    downloadDocument,
    isDownloadingDocument,
    isDownloadReady,
  ] = useDocumentDownload();

  const [
    watchDocumentConvertionStatus,
    watchDocumentConvertionStatusCancel,
    isWatcherExecuting,
  ] = useDocumentConvertionStatusWatcher();

  const isMobile = useIsMobile();

  const documentType = useMemo(
    () =>
      isTemplate
        ? document.type === DocumentTypes.FORM_REQUEST
          ? 'form'
          : 'template'
        : 'document',
    [document.type, isTemplate],
  );

  const preparer = useMemo(() => document.signers.find(s => s.isPreparer), [document]);

  const navigateToDocuments = useCallback(() => {
    switch (document.type) {
      case DocumentTypes.FORM_REQUEST:
        History.push(AuthorizedRoutePaths.FORM_REQUESTS);
        break;
      case DocumentTypes.TEMPLATE:
        History.push(AuthorizedRoutePaths.TEMPLATES);
        break;
      default:
        History.push(AuthorizedRoutePaths.DOCUMENTS);
    }
  }, [document.type]);

  const handleDocumentDownload = useCallback(async () => {
    try {
      await downloadDocument({
        documentId: document.id,
        signerId: document.type !== DocumentTypes.ME ? preparer?.id : undefined,
      });
    } catch (error) {
      Toast.handleErrors(error, { toastId: 'download_error' });
    }
  }, [document.id, document.type, downloadDocument, preparer]);

  const handleWatchDocumentConvertionStatus = useCallback(async () => {
    if (preparer)
      await watchDocumentConvertionStatus({
        signerId: preparer.id,
      });
  }, [preparer, watchDocumentConvertionStatus]);

  useEffect(() => {
    handleWatchDocumentConvertionStatus();
    return () => watchDocumentConvertionStatusCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDocumentConvertionStatusCancel]);

  return (
    <UIModal
      onClose={onClose || navigateToDocuments}
      className={classNames('successSendModal', {
        'successSendModal--template': isTemplate,
        mobile: isMobile,
      })}
      hideCloseIcon
      shouldCloseOnOverlayClick={false}
    >
      <div
        className={classNames('successSendModal__main', {
          'successSendModal__main--template': isTemplate,
          'successSendModal__main--banBorderBottom': isDisableActionPanel,
        })}
      >
        <ReactSVG src={CircleSuccessIcon} className="successSendModal__main-icon" />
        <div className="successSendModal__text-wrapper">
          <p className="successSendModal__title">
            {isTemplate
              ? document.type === DocumentTypes.FORM_REQUEST
                ? `Your form is ready`
                : `Your template is ready`
              : `Thanks for sending your document`}
          </p>
          <p className="successSendModal__text">
            {isTemplate ? (
              document.type === DocumentTypes.FORM_REQUEST ? (
                <>
                  Your form is now ready. Now you can create documents
                  <br />
                  based on this form.
                </>
              ) : (
                <>
                  Your template is now ready. Now you can create documents
                  <br />
                  based on this template.
                </>
              )
            ) : (
              <>
                You&apos;ll receive a notification when your document is processed.
                {document.type !== DocumentTypes.ME && (
                  <>
                    <br />
                    Subsequent notifications will arrive when it is signed.
                  </>
                )}
              </>
            )}
          </p>
        </div>
        {!isDisableActionPanel && (
          <UIButton
            priority="primary"
            className="successSendModal__button"
            handleClick={onConfirm || navigateToDocuments}
            title={`Back to ${capitalize(documentType)}s  `}
          />
        )}
      </div>
      {!isTemplate && !isDisableActionPanel && (
        <div className="successSendModal__footer">
          {isWatcherExecuting ? (
            <>
              <p className="successSendModal__title">{`The ${documentType} is being processed`}</p>
              <UISpinner wrapperClassName="successSendModal__footer-actions-spinner" />
            </>
          ) : (
            <>
              <p
                className={classNames('successSendModal__title', { mobile: isMobile })}
              >{`Save a copy of your ${documentType}`}</p>
              <div className="successSendModal__footer-actions">
                <button
                  onClick={handleDocumentDownload}
                  className={classNames(
                    'successSendModal__footer-actions-item',
                    'successSendModal__footer-actions-item--fill',
                  )}
                  disabled={isDownloadingDocument || !isDownloadReady}
                >
                  <ReactSVG
                    src={DownloadIcon}
                    className="successSendModal__footer-actions-item-icon"
                  />
                  {isMobile ? '' : 'Download'}
                </button>
                <button
                  onClick={() =>
                    printPdf({
                      documentId: document.id,
                      signerId: preparer?.id,
                    })
                  }
                  disabled={isPdfLoading}
                  className={classNames(
                    'successSendModal__footer-actions-item',
                    'successSendModal__footer-actions-item--stroke',
                  )}
                >
                  {isPdfLoading ? (
                    <UISpinner
                      width={19}
                      height={16}
                      wrapperClassName="successSendModal__footer-actions-item-icon"
                    />
                  ) : (
                    <ReactSVG
                      src={PrintIcon}
                      className="successSendModal__footer-actions-item-icon"
                    />
                  )}
                  {isMobile ? '' : 'Print'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </UIModal>
  );
};

export default SuccessSendModal;
