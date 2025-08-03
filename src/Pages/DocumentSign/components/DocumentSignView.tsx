import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { useDocumentSignInit, useSubmitSignedDocument } from 'Hooks/DocumentSign';
import { useDocumentFieldUpdateLocally } from 'Hooks/DocumentFields';
import { useIsMobile, useIsTablet, useModal } from 'Hooks/Common';
import { getCurrentDate } from 'Utils/functions';
import { selectDocumentFields } from 'Utils/selectors';
import { Document } from 'Interfaces/Document';
import { DocumentField, DocumentFieldTypes } from 'Interfaces/DocumentFields';

import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import { DocumentPreviewPage } from 'Components/DocumentPage';
import { PDFDocument } from 'Components/PDFDocument';
import FieldItem, { InteractModes } from 'Components/Interact/components/FieldItem';
import TermsModal from './TermsModal';
import { SigningButtonMobile } from './SigningButtonMobile';
import { PDFMetadata } from 'Interfaces/Common';
import { SelectedSignature } from 'Interfaces/Requisite';
import ConfirmModal from 'Components/ConfirmModal';
import ScaleDropDown from 'Components/Interact/components/ScaleDropDown';

interface DocumentSignViewProps {
  document: Document;
  redirectionPage: string;
  openSuccessModal: () => void;
}

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [pages, setPages] = useState<number[]>([]);
  const [isAutoUpdated, setIsAutoUpdated] = useState(false);
  const [pagesInLoadingCount, setPagesInLoadingCount] = useState(0);
  const [currentFieldId, setCurrentFieldId] = useState<DocumentField['id']>();
  const [nextStepButtonTitle, setNextStepButtonTitle] = useState('Start signing');
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);
  const [scaleCoefficient, setScaleCoefficient] = useState(
    isMobile || isTablet ? 0.5 : 1,
  );
  const [offset, setOffset] = useState(0);

  const onScaleChange = (scale: number) => {
    setScaleCoefficient(scale);
  };

  const [submitDocument, isSubmitLoading] = useSubmitSignedDocument();
  const handleDocumentFieldUpdate = useDocumentFieldUpdateLocally();
  const [initDocument, isInitializingDocument] = useDocumentSignInit(document);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();

  const pagesIsLoaded = useMemo(() => pagesInLoadingCount === 0, [pagesInLoadingCount]);
  const pdfPageMeta = document.pdfMetadata as PDFMetadata;
  const [
    lastSelectedSignature,
    setLastSelectedSignature,
  ] = useState<SelectedSignature | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const contentWidth = contentRef.current?.clientWidth || 0;
  const greaterWidthMetadata = useMemo(() => {
    return Object.values(pdfPageMeta).reduce(
      (greaterWidth, pageMetadata) => {
        return greaterWidth.width < pageMetadata.width ? pageMetadata : greaterWidth;
      },
      { width: 0 },
    );
  }, [pdfPageMeta]);

  const { pageStyle, documentScale } = useMemo(() => {
    const pdfMeta = document?.pdfMetadata && document.pdfMetadata[1];
    const width =
      mainRef.current?.clientWidth && mainRef.current?.clientWidth < 970
        ? mainRef.current?.clientWidth - (mainRef.current?.clientWidth < 768 ? 32 : 48)
        : 970;

    const documentScale = (width - 12) / (greaterWidthMetadata.width || 0);

    const pageStyle = {
      marginBottom: 20,
      width: pdfMeta?.width,
      height: pdfMeta?.height,
    };

    return { pageStyle, documentScale };
  }, [document, greaterWidthMetadata.width]);

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

  const handleTabKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        return handleFocusNextField();
      }
    },
    [handleFocusNextField],
  );

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
      const [documentPdf] = await initDocument(undefined);
      setPdfUrl(documentPdf.result);
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
        if (field.type === DocumentFieldTypes.Date) {
          handleDocumentFieldUpdate({
            id: field.id,
            text: getCurrentDate(
              field.dateFormat as NonNullable<DocumentField['dateFormat']>,
            ),
          });
        } else if (field.type === DocumentFieldTypes.Name) {
          const signer = document.signers.find(signer => signer?.id === field.signerId);
          handleDocumentFieldUpdate({ id: field.id, text: signer?.name });
        }
      });
      setIsAutoUpdated(true);
    }
  }, [document.signers, documentFields, handleDocumentFieldUpdate, isAutoUpdated]);

  useEffect(() => {
    if (document.testMode) showTestModeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decreasePagesInLoadingCount = useCallback(() => {
    setPagesInLoadingCount(prevState => prevState - 1);
  }, []);

  const handleFocus = useCallback((id: string) => {
    setCurrentFieldId(id);
  }, []);

  const initialDocumentWidth = greaterWidthMetadata.width * documentScale;

  useEffect(() => {
    const scrollBarWidth = scaleCoefficient < 1 ? initialDocumentWidth - contentWidth : 0;

    const offset =
      (initialDocumentWidth - initialDocumentWidth * scaleCoefficient - scrollBarWidth) /
      2;

    const resultOffset = offset > 0 ? offset : 0;

    setOffset(resultOffset);
  }, [contentWidth, documentScale, initialDocumentWidth, scaleCoefficient]);

  useEffect(() => {
    window.addEventListener('keydown', handleTabKeydown);

    return () => window.removeEventListener('keydown', handleTabKeydown);
  }, [handleTabKeydown]);

  const handlePdfLoadSuccess = useCallback(pdfDocumentProxy => {
    const pagesNumbers: number[] = [];
    for (let i = 1; i <= pdfDocumentProxy.numPages; i++) {
      pagesNumbers.push(i);
    }

    setPages(pagesNumbers);
    setPagesInLoadingCount(pdfDocumentProxy.numPages);
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
      <div
        className="document-sign__content-wrapper"
        style={{ width: initialDocumentWidth }}
      >
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
          <div className="document-sign__content-header-scale">
            <ScaleDropDown changeScale={onScaleChange} documentScale={scaleCoefficient} />
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
        <div className="document-sign__content" ref={contentRef}>
          <div
            style={{
              width:
                scaleCoefficient >= 1
                  ? greaterWidthMetadata.width * documentScale * scaleCoefficient
                  : undefined,
            }}
          >
            {pdfUrl && (
              <PDFDocument
                file={pdfUrl}
                onLoadSuccess={handlePdfLoadSuccess}
                externalLinkTarget={'_blank'}
              >
                {pages.map(pageNumber => (
                  <DocumentPreviewPage
                    key={pageNumber}
                    pageNumber={pageNumber}
                    onLoad={decreasePagesInLoadingCount}
                    scale={documentScale * scaleCoefficient}
                    offset={offset}
                    style={{
                      ...pageStyle,
                      height: pdfPageMeta && pdfPageMeta[pageNumber].height,
                      width: pdfPageMeta && pdfPageMeta[pageNumber].width,
                    }}
                  >
                    {documentFields
                      .filter(field => field.pageNumber === pageNumber)
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
              </PDFDocument>
            )}
          </div>
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
