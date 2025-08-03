import React, { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  useCodeAccessSend,
  useDeclineSigningRequest,
  useSignatoryOpenedSend,
  useSignerDocumentGet,
} from 'Hooks/DocumentSign';
import { useModal } from 'Hooks/Common';
import ConfirmModal from 'Components/ConfirmModal';
import DocumentSignModal from 'Components/DocumentSignModal';
import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import { Document, DocumentForSigners, Signer } from 'Interfaces/Document';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import { isDocumentAccessRequired } from 'Utils/typeGuards';
import { ConfirmCodeModal, DocumentDeclineModal, DocumentSignView } from '.';

interface DocumentSigningViewProps {
  signerId?: string | null;
  documentId?: string | null;
  declineImmediately: boolean;
}

const DocumentSigningView = ({
  signerId,
  documentId,
  declineImmediately,
}: DocumentSigningViewProps) => {
  const [signerDocument, setSignerDocument] = useState<DocumentForSigners | null>(null);

  const [getSignerDocument, isGettingDocument] = useSignerDocumentGet();
  const [sendCodeAccess, isCodeSending] = useCodeAccessSend();
  const [sendSignatoryOpened] = useSignatoryOpenedSend();
  const [declineSigningRequest, isDeclineLoading] = useDeclineSigningRequest();

  const navigateToRoot = useCallback(() => {
    History.replace(UnauthorizedRoutePaths.BASE_PATH);
  }, []);

  const [openSuccessfulSignModal, closeSuccessfulSignModal] = useModal(
    () => (
      <DocumentSignModal documentId={documentId} onClose={closeSuccessfulSignModal} />
    ),
    [documentId, signerId],
  );

  const [openSuccessfulDeclineModal, closeSuccessfulDeclineModal] = useModal(
    () => <DocumentDeclineModal onClose={closeSuccessfulDeclineModal} />,
    [],
  );

  const [openCodeConfirmationModal, closeCodeConfirmationModal] = useModal(
    () => (
      <ConfirmCodeModal
        onClose={closeCodeConfirmationModal}
        isSending={isCodeSending}
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        sendCode={handleCodeAccessSend}
        title="Enter the access code:"
      />
    ),
    [signerId, documentId],
  );

  const handleCodeAccessSend = useCallback(
    async (codeAccess: string) => {
      if (!documentId || !signerId) return;

      try {
        const document = await sendCodeAccess({ codeAccess, documentId, signerId });

        if (isNotEmpty(document)) {
          setSignerDocument(document);
          sendSignatoryOpened({ documentId, signerId });
          closeCodeConfirmationModal();
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [
      closeCodeConfirmationModal,
      signerId,
      documentId,
      sendCodeAccess,
      sendSignatoryOpened,
    ],
  );

  const handleDeclineSigningRequest = useCallback(async () => {
    if (!documentId || !signerId) return;

    try {
      await declineSigningRequest({ documentId, signerId });
      Toast.success('Signature request was declined.');

      if (signerDocument?.redirectionPage) {
        window.location.href = signerDocument?.redirectionPage;
      } else {
        openSuccessfulDeclineModal();
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    signerId,
    documentId,
    declineSigningRequest,
    openSuccessfulDeclineModal,
    signerDocument,
  ]);

  const [showDeclineConfirmModal, hideDeclineConfirmModal] = useModal(
    () => (
      <ConfirmModal
        onClose={hideDeclineConfirmModal}
        confirmComponent={() => (
          <UIButton
            priority="red"
            handleClick={handleDeclineSigningRequest}
            className="confirmModal__button--delete"
            title={'Decline'}
            isLoading={isDeclineLoading}
          />
        )}
        cancelComponent={() => (
          <div
            className="documents__deleteModal--cancel"
            onClick={hideDeclineConfirmModal}
          >
            Cancel
          </div>
        )}
        confirmText={'Decline'}
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to decline this signing request?
          </h5>
        </div>
      </ConfirmModal>
    ),
    [handleDeclineSigningRequest],
  );

  const handleDocumentGet = useCallback(
    async (documentId: Document['id'], signerId: Signer['id']) => {
      try {
        const document = await getSignerDocument({ documentId, signerId });

        if (!isNotEmpty(document)) return;

        if (isDocumentAccessRequired(document)) {
          openCodeConfirmationModal();
        } else {
          setSignerDocument(document);
          sendSignatoryOpened({ documentId, signerId });
        }

        if (declineImmediately) {
          showDeclineConfirmModal();
        }
      } catch (error) {
        Toast.handleErrors(error);
        Sentry.captureException(error, {
          extra: {
            page: 'DocumentSigningView',
            func: 'handleDocumentGet',
          },
        });
        navigateToRoot();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSignerDocument, sendSignatoryOpened],
  );

  useEffect(() => {
    if (documentId && signerId) {
      handleDocumentGet(documentId, signerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, signerId]);

  if (isGettingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  if (signerDocument) {
    return (
      <DocumentSignView
        document={signerDocument}
        openSuccessModal={openSuccessfulSignModal}
        redirectionPage={signerDocument?.redirectionPage}
      />
    );
  }

  return null;
};

export default DocumentSigningView;
