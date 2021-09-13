import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { useDocumentSignInit } from 'Hooks/DocumentSign';
import {
  useDocumentFieldUpdateLocally,
  useSubmitSignedDocument,
} from 'Hooks/DocumentFields';
import { useModal, useWindowSize } from 'Hooks/Common';
import { getCurrentDate } from 'Utils/functions';
import { selectDocumentFields } from 'Utils/selectors';
import { Document } from 'Interfaces/Document';
import {
  DocumentField,
  DocumentFieldTypes,
  DocumentFieldUpdatePayload,
} from 'Interfaces/DocumentFields';

import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import { DocumentPreviewPage } from 'Components/DocumentPage';
import FieldItem, { InteractModes } from 'Components/Interact/components/FieldItem';
import TermsModal from './TermsModal';
import { SigningButtonMobile } from './SigningButtonMobile';
import { PDFMetadata } from 'Interfaces/Common';
import { SelectedSignature } from 'Interfaces/Requisite';
import ConfirmModal from 'Components/ConfirmModal';

interface DocumentSignViewProps {
  document: Document;
  redirectionPage: string;
  openSuccessModal: () => void;
}

const sizes = {
  pageContainerWidth: 955,
  pageMarginBottom: 20,
};

const sortFieldPredicate = (firstField: DocumentField, secondField: DocumentField) => {
  const pageDiff = firstField.pageNumber - secondField.pageNumber;

  if (!pageDiff) {
    return firstField.coordinateY - secondField.coordinateY;
  }

  return pageDiff;
};

const DocumentSignView = ({
  document,
  redirectionPage,
  openSuccessModal,
}: DocumentSignViewProps) => {
  const [pages, setPages] = useState<string[]>([]);
  const [isAutoUpdated, setIsAutoUpdated] = useState(false);
  const [pagesInLoadingCount, setPagesInLoadingCount] = useState(0);
  const [currentFieldId, setCurrentFieldId] = useState<DocumentField['id']>();
  const [nextStepButtonTitle, setNextStepButtonTitle] = useState('Start signing');
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);

  const [submitDocument, isSubmitLoading] = useSubmitSignedDocument();
  const handleDocumentFieldUpdate = useDocumentFieldUpdateLocally();
  const [initDocument, isInitializingDocument] = useDocumentSignInit(document);

  const pagesIsLoaded = useMemo(() => pagesInLoadingCount === 0, [pagesInLoadingCount]);
  const [width, height] = useWindowSize();
  const pdfPageMeta = document.pdfMetadata as PDFMetadata;
  const [
    lastSelectedSignature,
    setLastSelectedSignature,
  ] = useState<SelectedSignature | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const { pageStyle, documentScale } = useMemo(() => {
    const pdfMeta = document?.pdfMetadata && document.pdfMetadata[1];
    const width =
      mainRef.current?.clientWidth && mainRef.current?.clientWidth < 970
        ? mainRef.current?.clientWidth - (mainRef.current?.clientWidth < 768 ? 32 : 48)
        : 970;
    const greaterWidthMetadata = Object.values(pdfPageMeta).reduce(
      (greaterWidth, pageMetadata) => {
        return greaterWidth.width < pageMetadata.width ? pageMetadata : greaterWidth;
      },
      { width: 0 },
    );

    const documentScale = (width - 12) / (greaterWidthMetadata.width || 0);

    const pageStyle = {
      marginBottom: 20,
      width: pdfMeta?.width,
      height: pdfMeta?.height,
    };

    return { pageStyle, documentScale };
  }, [document, pdfPageMeta, mainRef.current?.clientWidth]);

  const [requiredUnsignedFields, requiredUnsignedFieldsCount] = useMemo(() => {
    const fields = documentFields
      .filter(field => !field.signed && field.required)
      .sort(sortFieldPredicate);

    return [fields, fields.length];
  }, [documentFields]);

  const handleFocusNextField = useCallback(() => {
    setNextStepButtonTitle('Next step');

    if (!currentFieldId) {
      return setCurrentFieldId(requiredUnsignedFields[0].id);
    }

    const currentIndex = requiredUnsignedFields
      .map(field => field.id)
      .indexOf(currentFieldId);

    if (requiredUnsignedFields.length === 1 && currentIndex === 0) {
      setTimeout(() => setCurrentFieldId(requiredUnsignedFields[0].id), 0);
      return setCurrentFieldId(undefined);
    }

    if (requiredUnsignedFields.length - 1 === currentIndex) {
      return setCurrentFieldId(requiredUnsignedFields[0].id);
    }

    setCurrentFieldId(requiredUnsignedFields[currentIndex + 1].id);
  }, [currentFieldId, requiredUnsignedFields]);

  const handleSubmitDocument = useCallback(async () => {
    try {
      await submitDocument({
        documentId: document.id,
        fields: documentFields,
        signerId: document.signers[0].id,
      });
      Toast.success('Document submitted.');

      if (redirectionPage) {
        window.location.href = redirectionPage;
      } else {
        openSuccessModal();
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    document.id,
    document.signers,
    documentFields,
    openSuccessModal,
    redirectionPage,
    submitDocument,
  ]);

  const [showTermsModal, hideTermsModal] = useModal(
    () => (
      <TermsModal
        documentName={document.title}
        onClose={hideTermsModal}
        onCancel={hideTermsModal}
        onConfirm={handleSubmitDocument}
        isConfirmLoading={isSubmitLoading}
      />
    ),
    [handleSubmitDocument],
  );

  const [showTestModeModal, hideTestModeModal] = useModal(
    () => (
      <ConfirmModal
        onClose={hideTestModeModal}
        onConfirm={hideTestModeModal}
        isCancellable={false}
      >
        <div className="billing__plan-modal">
          <div className="billing__plan-modal-title">
            Document was created in test mode
          </div>
          <div className="billing__plan-modal-subtitle">
            This document is not legally binding.
          </div>
        </div>
      </ConfirmModal>
    ),
    [handleSubmitDocument],
  );

  const handleDocumentInit = useCallback(async () => {
    try {
      const [pages] = await initDocument(undefined);

      setPages(pages);
      setPagesInLoadingCount(pages.length);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [initDocument]);

  useEffect(() => {
    handleDocumentInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (documentFields.length > 0 && !isAutoUpdated) {
      documentFields.forEach(field => {
        if (field.type === DocumentFieldTypes.Date)
          handleDocumentFieldUpdate({
            id: field.id,
            text: getCurrentDate(
              field.dateFormat as NonNullable<DocumentField['dateFormat']>,
            ),
          });
      });
      setIsAutoUpdated(true);
    }
  }, [documentFields, handleDocumentFieldUpdate, isAutoUpdated]);

  useEffect(() => {
    if (document.testMode) showTestModeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decreasePagesInLoadingCount = useCallback(() => {
    setPagesInLoadingCount(pagesInLoadingCount - 1);
  }, [pagesInLoadingCount]);

  const handleFocus = useCallback((id: string) => {
    setCurrentFieldId(id);
  }, []);

  if (isInitializingDocument) {
    return (
      <div className="document-sign__main">
        <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />
      </div>
    );
  }

  return (
    <div className="document-sign__main" ref={mainRef}>
      <div className="document-sign__content-wrapper">
        <div className="document-sign__content-header">
          <div className="document-sign__content-header-item">
            <ul className="document-sign__dots">
              <li />
              <li />
              <li />
            </ul>
            {requiredUnsignedFieldsCount > 0 && (
              <div className="document-sign__content-header-counter">
                FIELDS LEFT:
                <div className="document-sign__content-header-count-wrapper">
                  <span className="document-sign__content-header-count">
                    {requiredUnsignedFieldsCount}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="document-sign__content-header-item">
            {requiredUnsignedFieldsCount > 0 ? (
              <UIButton
                priority="primary"
                title={nextStepButtonTitle}
                handleClick={handleFocusNextField}
                disabled={!pagesIsLoaded}
              />
            ) : (
              <UIButton
                priority="primary"
                handleClick={showTermsModal}
                title="Submit"
                isLoading={isSubmitLoading}
                disabled={isSubmitLoading}
              />
            )}
          </div>
        </div>
        <div className="document-sign__content">
          {pages.map((page, pageNumber) => (
            <DocumentPreviewPage
              key={pageNumber}
              page={page}
              onLoad={decreasePagesInLoadingCount}
              scale={documentScale}
              style={{
                ...pageStyle,
                height: pdfPageMeta && pdfPageMeta[pageNumber + 1].height,
                width: pdfPageMeta && pdfPageMeta[pageNumber + 1].width,
              }}
            >
              {documentFields
                .filter(field => field.pageNumber - 1 === pageNumber)
                .map(field => (
                  <FieldItem
                    documentScale={documentScale}
                    inFocus={currentFieldId === field.id}
                    key={field.id}
                    field={field}
                    onFocus={handleFocus}
                    isResizable={false}
                    onChangeSigner={() => {}}
                    interactMode={InteractModes.SIGNING}
                    onDocumentFieldUpdate={handleDocumentFieldUpdate}
                    lastSelectedSignature={lastSelectedSignature}
                    setLastSelectedSignature={setLastSelectedSignature}
                  />
                ))}
            </DocumentPreviewPage>
          ))}
        </div>
      </div>
      {requiredUnsignedFieldsCount > 0 ? (
        <SigningButtonMobile
          title={nextStepButtonTitle}
          handleClick={handleFocusNextField}
          disabled={!pagesIsLoaded}
        />
      ) : (
        <SigningButtonMobile
          handleClick={showTermsModal}
          title="Submit"
          isLoading={isSubmitLoading}
          disabled={isSubmitLoading}
        />
      )}
    </div>
  );
};

export default DocumentSignView;
