import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DocumentValidators,
  useEmbedDocumentGet,
  useEmbedDocumentInteractInit,
  useEmbedDocumentTokenInit,
  useEmbedDocumentUpdateCancel,
} from 'Hooks/Document';
import {
  useEmbedDocumentFieldCreate,
  useEmbedDocumentFieldDelete,
  useEmbedDocumentFieldHistory,
  useEmbedDocumentFieldUpdate,
} from 'Hooks/DocumentFields';
import { Document, DocumentUpdatePayload, DocumentValues } from 'Interfaces/Document';
import { BaseInteractModal } from './BaseInteractModal';
import { useLocation } from 'react-router-dom';
import useEmbedDocumentSendOut from 'Hooks/DocumentSign/useEmbedDocumentSendOut';
import { useModal } from 'react-modal-hook';
import { SuccessSendModal, ValidationModal } from 'Components/DocumentForm';
import { RequestErrorTypes } from 'Interfaces/Common';
import UpgradeModal from 'Components/UpgradeModal';
import { processSubmissionErrors } from 'Utils/functions';
import Toast from 'Services/Toast';
import useEmbedDocumentUpdate from 'Hooks/Document/useEmbedDocumentUpdate';
import jwtDecode from 'jwt-decode';
import { DateFormats } from 'Interfaces/User';
import { RequisiteValueType } from 'Interfaces/Requisite';
import {
  DocumentField,
  DocumentFieldDeletePayload,
  DocumentFieldsCRUDMeta,
  DocumentFieldUpdatePayload,
} from 'Interfaces/DocumentFields';
import { DocumentFilesGetPayload } from 'Hooks/Document/useEmbedDocumentFilesGet';

export interface EmbedInteractModalProps {
  documentId: Document['id'];
}

export const EmbedInteractModal = () => {
  const [updateEmbedDocument] = useEmbedDocumentUpdate();
  const cancelEmbedDocumentUpdate = useEmbedDocumentUpdateCancel();
  const validateDocument = DocumentValidators.useDocumentValidation();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { search } = useLocation();
  const [getEmbedDocument] = useEmbedDocumentGet();
  const [sendEmbedDocument] = useEmbedDocumentSendOut();

  const [initEmbedDocumentToken, removeEmbedDocumentToken] = useEmbedDocumentTokenInit();

  const createEmbedDocumentField = useEmbedDocumentFieldCreate();
  const deleteEmbedDocumentField = useEmbedDocumentFieldDelete();
  const updateEmbedDocumentField = useEmbedDocumentFieldUpdate();
  const [
    redoEmbedDocumentFieldAction,
    undoEmbedDocumentFieldAction,
    isNextAvailable,
    isPrevAvailable,
  ] = useEmbedDocumentFieldHistory();
  const [
    initEmbedDocumentInteract,
    isEmbedDocumentInteractLoading,
  ] = useEmbedDocumentInteractInit();

  const { token, documentId, dateFormat, availableSignatureTypes } = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token');
    let parsedToken;
    let availableSignatureTypes;
    let documentId;

    if (token) {
      parsedToken = jwtDecode(token);
      const signatureTypesPreferences = parsedToken.settings.signatureTypesPreferences;
      availableSignatureTypes = [
        signatureTypesPreferences.isTypedSignaturesAvailable && RequisiteValueType.TEXT,
        signatureTypesPreferences.isDrawnSignaturesAvailable && RequisiteValueType.DRAW,
        signatureTypesPreferences.isUploadedSignaturesAvailable &&
          RequisiteValueType.UPLOAD,
      ].filter(Boolean);
      documentId = parsedToken.sub;
    }

    return {
      token: token ? token : '',
      documentId: documentId,
      dateFormat: parsedToken ? parsedToken.settings.dateFormat : DateFormats.DD_MM_YYYY,
      availableSignatureTypes: availableSignatureTypes,
    };
  }, [search]);

  const [currentDocument, setCurrentDocument] = useState<Document>();

  const handleClose = useCallback(() => {}, []);

  const [openValidationModal, closeValidationModal] = useModal(
    () => (
      <ValidationModal
        onClose={closeValidationModal}
        validationErrors={validationErrors}
      />
    ),
    [validationErrors],
  );

  const [openSuccessModal, closeSuccessModal] = useModal(
    () => (
      <SuccessSendModal
        onClose={closeSuccessModal}
        document={currentDocument as Document}
        isDisableActionPanel
      />
    ),
    [currentDocument],
  );

  const [openUpgradeModal, closeUpgradeModal] = useModal(
    () => (
      <UpgradeModal onClose={closeUpgradeModal}>
        Contact the administrator and report the problem.
        <br />
        Code: FREE_DOCS_LIMIT
      </UpgradeModal>
    ),
    [],
  );

  const onSubmit = useCallback(
    async (values: DocumentValues) => {
      try {
        let scopedDocument;

        if (currentDocument) {
          scopedDocument = (await updateEmbedDocument({
            values: {
              ...values,
              templateId: null,
              documentId: currentDocument.id,
            },
          })) as Document;
        }

        const documentValidationErrors = validateDocument(scopedDocument);

        if (documentValidationErrors.length !== 0) {
          openValidationModal();
          return setValidationErrors(documentValidationErrors);
        }

        if (token) {
          await sendEmbedDocument({ documentId: scopedDocument.id });
        }

        return openSuccessModal();
      } catch (error) {
        if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
          return openUpgradeModal();
        }

        Toast.handleErrors(error);

        return processSubmissionErrors(error);
      }
    },
    [
      currentDocument,
      openSuccessModal,
      openUpgradeModal,
      openValidationModal,
      sendEmbedDocument,
      token,
      updateEmbedDocument,
      validateDocument,
    ],
  );

  const handleUpdateEmbedDocument = useCallback(
    async (payload: DocumentUpdatePayload) => {
      await updateEmbedDocument(payload);
    },
    [updateEmbedDocument],
  );

  const handleCreateEmbedDocumentField = useCallback(
    (documentField: DocumentField, meta?: DocumentFieldsCRUDMeta) => {
      createEmbedDocumentField(documentField, meta);
    },
    [createEmbedDocumentField],
  );

  const handleDeleteEmbedDocumentField = useCallback(
    (payload: DocumentFieldDeletePayload, meta?: DocumentFieldsCRUDMeta) => {
      deleteEmbedDocumentField(payload, meta);
    },
    [deleteEmbedDocumentField],
  );

  const handleUpdateEmbedDocumentField = useCallback(
    (documentField: DocumentFieldUpdatePayload, meta?: DocumentFieldsCRUDMeta) => {
      updateEmbedDocumentField(documentField, meta);
    },
    [updateEmbedDocumentField],
  );

  const handleUndoEmbedDocumentFieldAction = useCallback(() => {
    undoEmbedDocumentFieldAction();
  }, [undoEmbedDocumentFieldAction]);

  const handleRedoEmbedDocumentFieldAction = useCallback(() => {
    redoEmbedDocumentFieldAction();
  }, [redoEmbedDocumentFieldAction]);

  const handleCancelEmbedDocumentUpdate = useCallback(() => {
    cancelEmbedDocumentUpdate();
  }, [cancelEmbedDocumentUpdate]);

  const handleInitDocumentInteract = useCallback(
    (paylaod: DocumentFilesGetPayload) => {
      return initEmbedDocumentInteract(paylaod);
    },
    [initEmbedDocumentInteract],
  );

  const [showInteractModal] = useModal(() => {
    if (documentId) {
      return (
        <BaseInteractModal
          documentId={documentId}
          handleSubmit={onSubmit}
          onClose={handleClose}
          createDocumentField={handleCreateEmbedDocumentField}
          deleteDocumentField={handleDeleteEmbedDocumentField}
          updateDocumentField={handleUpdateEmbedDocumentField}
          updateDocument={handleUpdateEmbedDocument}
          cancelDocumentUpdate={handleCancelEmbedDocumentUpdate}
          isDisableCancelButton={true}
          isDisablePreparerSigner={true}
          dateFormat={dateFormat}
          availableSignatureTypes={availableSignatureTypes}
          initDocumentInteract={handleInitDocumentInteract}
          isDocumentInteractLoading={isEmbedDocumentInteractLoading}
          redoDocumentFieldAction={handleRedoEmbedDocumentFieldAction}
          undoDocumentFieldAction={handleUndoEmbedDocumentFieldAction}
          isNextAvailable={isNextAvailable}
          isPrevAvailable={isPrevAvailable}
          enableFullscreen={true}
        />
      );
    }

    return null;
  }, [
    documentId,
    isEmbedDocumentInteractLoading,
    isNextAvailable,
    isPrevAvailable,
    handleUndoEmbedDocumentFieldAction,
    handleRedoEmbedDocumentFieldAction,
  ]);

  const handleSetToken = useCallback(async () => {
    initEmbedDocumentToken({ token });
    return () => removeEmbedDocumentToken();
  }, [initEmbedDocumentToken, removeEmbedDocumentToken, token]);

  const handleEmbedInteractInitialize = useCallback(async () => {
    if (documentId) {
      await handleSetToken();
      setCurrentDocument((await getEmbedDocument({ documentId })) as Document);
      showInteractModal();
    }

    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (documentId) {
      handleEmbedInteractInitialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  return null;
};

export default EmbedInteractModal;
