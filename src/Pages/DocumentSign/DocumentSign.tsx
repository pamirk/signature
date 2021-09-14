import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import {
  useSignerDocumentGet,
  useAvailableSignersGet,
  useDocumentSigning,
  useSignatoryOpenedSend,
} from 'Hooks/DocumentSign';
import { useBeaconRemove, useModal } from 'Hooks/Common';
import History from 'Services/History';
import { isNotEmpty } from 'Utils/functions';
import { Document, DocumentForSigners, SignerOption, Signer } from 'Interfaces/Document';
import DocumentSignModal from 'Components/DocumentSignModal';
import UISpinner from 'Components/UIComponents/UISpinner';
import { ConfirmCodeModal, DocumentSignView } from './components';
import SignerSelectModal from './components/SignerSelectModal';
import useCodeAccessSend from 'Hooks/DocumentSign/useCodeAccessSend';
import Toast from 'Services/Toast';
import { isDocumentAccessRequired } from 'Utils/typeGuards';

interface PageParams {
  documentId: Document['id'];
}

const DocumentSign = ({ location, match }: RouteChildrenProps<PageParams>) => {
  useBeaconRemove();

  const [signerDocument, setSignerDocument] = useState<DocumentForSigners | null>(null);
  const [currentSigner, setCurrentSigner] = useState<SignerOption | null>(null);
  const [signerOptions, setSignerOptions] = useState<SignerOption[]>([]);

  const [initDocumentSigning, finishDocumentSigning] = useDocumentSigning();
  const [
    getAvailableSignersOptions,
    isGettingAvailableSigners,
  ] = useAvailableSignersGet();
  const [getSignerDocument, isGettingDocument] = useSignerDocumentGet();
  const [sendCodeAccess, isCodeSending] = useCodeAccessSend();
  const [sendSignatoryOpened] = useSignatoryOpenedSend();

  const { signToken, documentId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const documentId = match?.params.documentId;

    return {
      signToken: searchParams.get('signAccessToken'),
      documentId,
    };
  }, [location.search, match]);

  const navigateToRoot = useCallback(() => {
    History.replace('/');
  }, []);

  const [openSignerOptionModal, closeSignerOptionModal] = useModal(
    () => (
      <SignerSelectModal
        onClose={closeSignerOptionModal}
        onSignerSelect={setCurrentSigner}
        signerOptions={signerOptions}
      />
    ),
    [signerOptions],
  );

  const [openSuccessfulSignModal, closeSuccessfulSignModal] = useModal(
    () => (
      <DocumentSignModal documentId={documentId} onClose={closeSuccessfulSignModal} />
    ),
    [documentId, currentSigner, signerDocument],
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
    [currentSigner, documentId],
  );

  const handleCodeAccessSend = useCallback(
    async (codeAccess: string) => {
      try {
        if (documentId && currentSigner) {
          const document = await sendCodeAccess({
            codeAccess,
            documentId,
            signerId: currentSigner.id,
          });

          if (isNotEmpty(document)) {
            setSignerDocument(document);
            sendSignatoryOpened({ documentId, signerId: currentSigner.id });
            closeCodeConfirmationModal();
          }
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [
      closeCodeConfirmationModal,
      currentSigner,
      documentId,
      sendCodeAccess,
      sendSignatoryOpened,
    ],
  );

  const handleSignersGet = useCallback(
    async (documentId: Document['id']) => {
      try {
        const signerOptions = await getAvailableSignersOptions({ documentId });
        if (isNotEmpty(signerOptions) && signerOptions.length === 1) {
          setCurrentSigner(signerOptions[0]);
        } else {
          setSignerOptions(signerOptions as SignerOption[]);
          openSignerOptionModal();
        }
      } catch (error) {
        navigateToRoot();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAvailableSignersOptions],
  );

  const handleDocumentGet = useCallback(
    async (documentId: Document['id'], signerId: Signer['id']) => {
      try {
        const document = await getSignerDocument({
          documentId,
          signerId,
        });

        if (!isNotEmpty(document)) return;

        if (isDocumentAccessRequired(document)) {
          openCodeConfirmationModal();
        } else {
          setSignerDocument(document);
          sendSignatoryOpened({ documentId, signerId });
        }
      } catch (error) {
        navigateToRoot();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSignerDocument, sendSignatoryOpened],
  );

  useEffect(() => {
    if (!signToken || !documentId) {
      return navigateToRoot();
    }

    initDocumentSigning({ token: signToken });
    handleSignersGet(documentId);

    return () => finishDocumentSigning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishDocumentSigning, initDocumentSigning, navigateToRoot, signToken]);

  useEffect(() => {
    if (currentSigner && documentId) {
      handleDocumentGet(documentId, currentSigner.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, currentSigner]);

  if (isGettingDocument || isGettingAvailableSigners) {
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

export default DocumentSign;
