import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
// import * as Sentry from '@sentry/react';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useDocumentSigning, useSigningDocumentGet } from 'Hooks/DocumentSign';
import { useBeaconRemove, useModal } from 'Hooks/Common';
import {
  Document,
  DocumentForSigning,
  DocumentStatuses,
  SignerOption,
} from 'Interfaces/Document';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import {
  isDocumentWithSingleSigners,
  shouldOpenDocumentSignersModal,
} from 'Utils/typeGuards';
import { DocumentStatus, DocumentSigningView, SignerSelectModal } from './components';

const navigateToRoot = () => History.replace(UnauthorizedRoutePaths.BASE_PATH);

interface PageParams {
  documentId: Document['id'];
}

const DocumentSign = ({ location, match }: RouteChildrenProps<PageParams>) => {
  useBeaconRemove();

  const [signingDocument, setSigningDocument] = useState<DocumentForSigning | null>(null);
  const [currentSigner, setCurrentSigner] = useState<SignerOption | null>(null);
  const signerOptionsRef = useRef<SignerOption[]>([]);

  const [initDocumentSigning, finishDocumentSigning] = useDocumentSigning();
  const [getSigningDocument, isGettingSigningDocument] = useSigningDocumentGet();

  const { signToken, declineImmediately, documentId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const documentId = match?.params.documentId;

    return {
      signToken: searchParams.get('signAccessToken'),
      declineImmediately: searchParams.get('declineImmediately') === 'true',
      documentId,
    };
  }, [location.search, match]);

  const [openSignerOptionModal, closeSignerOptionModal] = useModal(
    () => (
      <SignerSelectModal
        onClose={closeSignerOptionModal}
        onSignerSelect={setCurrentSigner}
        signerOptions={signerOptionsRef.current}
      />
    ),
    [],
  );

  useEffect(() => {
    if (!signToken || !documentId) {
      if (!signToken) {
        Toast.handleErrors({ message: 'signToken is not provided' });
      }

      if (!documentId) {
        Toast.handleErrors({ message: 'documentId is not provided' });
      }

      // Sentry.captureException(new Error('Redirecting to root'), {
      //   extra: {
      //     page: 'DocumentSign',
      //     func: 'useEffect',
      //     documentId,
      //     signToken,
      //   },
      // });

      return navigateToRoot();
    }
  }, [documentId, signToken]);

  useEffect(() => {
    async function handleSigningDocumentGet(documentId: Document['id']) {
      try {
        const document = await getSigningDocument({ documentId });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isNotEmpty(document) && setSigningDocument(document);

        if (shouldOpenDocumentSignersModal(document)) {
          signerOptionsRef.current = document.signers;
          openSignerOptionModal();
        } else if (isDocumentWithSingleSigners(document)) {
          setCurrentSigner(document.signers[0]);
        }
      } catch (error) {
        if (error.statusCode !== HttpStatus.NOT_FOUND) {
          Toast.handleErrors(error);
          // Sentry.captureException(error, {
          //   extra: {
          //     page: 'DocumentSign',
          //     func: 'handleDocumentGet',
          //   },
          // });
          navigateToRoot();
        }
      }
    }

    if (signToken && documentId) {
      initDocumentSigning({ token: signToken });
      handleSigningDocumentGet(documentId);
    }

    return () => finishDocumentSigning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishDocumentSigning, initDocumentSigning, signToken]);

  if (isGettingSigningDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  const isCurrentSignerUserAuthorized = !!currentSigner?.user?.isAuthorized;

  if (signingDocument) {
    const companyLogoKey = signingDocument.user?.team?.owner?.companyLogoKey;

    return signingDocument.status === DocumentStatuses.COMPLETED ? (
      <DocumentStatus
        status="completed"
        authorized={isCurrentSignerUserAuthorized}
        companyLogoKey={companyLogoKey}
      />
    ) : signingDocument.status === DocumentStatuses.AWAITING &&
      !!currentSigner?.isFinished ? (
      <DocumentStatus
        status="awaiting"
        authorized={isCurrentSignerUserAuthorized}
        companyLogoKey={companyLogoKey}
      />
    ) : (
      <DocumentSigningView
        signerId={currentSigner?.id}
        documentId={documentId}
        declineImmediately={declineImmediately}
      />
    );
  }

  return (
    <DocumentStatus status="unavailable" authorized={isCurrentSignerUserAuthorized} />
  );
};

export default DocumentSign;
