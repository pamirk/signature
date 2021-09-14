import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { DocumentField } from 'Interfaces/DocumentFields';
import {
  useDocumentInteractInit,
  useDocumentGuard,
  useDocumentPrint,
  useDocumentDownload,
} from 'Hooks/Document';
import { useDocumentFieldUpdateLocally } from 'Hooks/DocumentFields';
import { selectDocumentFields, selectDocument } from 'Utils/selectors';
import { checkIfDateOrText } from 'Utils/functions';
import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import FieldItem from 'Components/Interact/components/FieldItem';
import DownloadIcon from 'Assets/images/icons/doc-download-icon.svg';
import PrintIcon from 'Assets/images/icons/print-icon.svg';
import DocumentActivityList from './components/DocumentActivityList';
import { DocumentPreviewPage } from 'Components/DocumentPage';
import HeaderButton from './components/HeaderButton';
import { PDFMetadata } from 'Interfaces/Common';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface DocumentParams {
  documentId: Document['id'];
}

const sizes = {
  pageContainerWidth: window.innerWidth < 768 ? window.innerWidth : 955,
  pageMarginBottom: 20,
};

const DocumentPreview = ({ match }: RouteChildrenProps<DocumentParams>) => {
  const documentId = useMemo(() => match?.params.documentId, [match]);
  const currentDocument = useSelector(state => selectDocument(state, { documentId }));
  const [downloadDocument, isDownloadingDocument] = useDocumentDownload();
  const [printPdf, isPdfLoading] = useDocumentPrint(currentDocument as Document);
  const [
    initDocumentInteract,
    isDocumentInteractInitializing,
  ] = useDocumentInteractInit();
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);
  const [pages, setPages] = useState<string[]>([]);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const pdfMeta = useMemo(() => currentDocument?.pdfMetadata || ({} as PDFMetadata), [
    currentDocument,
  ]);
  const isMobile = useIsMobile();

  const greaterWidthMetadata = useMemo(() => {
    return Object.values(pdfMeta).reduce(
      (greaterWidth, pageMetadata) => {
        return greaterWidth.width < pageMetadata.width ? pageMetadata : greaterWidth;
      },
      { width: 0 },
    );
  }, [pdfMeta]);

  const [documentScale, setDocumentScale] = useState(1);
  const [pagesInLoadingCount, setPagesInLoadingCount] = useState(0);
  const updateDocumentFieldLocally = useDocumentFieldUpdateLocally();

  const handleDocumentNotFound = useCallback(() => {
    History.push('/documents');
  }, []);

  const handleDocumentDownload = useCallback(async () => {
    try {
      if (currentDocument?.id) {
        await downloadDocument({ documentId: currentDocument.id });
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [downloadDocument, currentDocument]);

  const isCheckingDocument = useDocumentGuard({
    documentId,
    onFailure: handleDocumentNotFound,
  });

  const decreasePagesInLoadingCount = useCallback(() => {
    setPagesInLoadingCount(pagesInLoadingCount - 1);
  }, [pagesInLoadingCount]);

  useEffect(() => {
    if (greaterWidthMetadata) {
      setDocumentScale(sizes.pageContainerWidth / greaterWidthMetadata.width);
    }
  }, [greaterWidthMetadata]);

  const handleGetConvertedDocument = useCallback(
    async (currentDocument: Document) => {
      try {
        const [pages] = await initDocumentInteract({ document: currentDocument });

        setPagesInLoadingCount(pages.length);
        setPages(pages);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (currentDocument) {
      handleGetConvertedDocument(currentDocument);
    }
  }, [handleGetConvertedDocument, currentDocument]);

  const calculateDocumentFieldStyles = useCallback(
    (documentField: DocumentField) => {
      const fieldSigner = currentDocument?.signers.find(
        signer => signer.id === documentField.signerId,
      );
      const isDateOrText = checkIfDateOrText(documentField.type);
      const sizeStyles =
        isDateOrText && fieldSigner?.isPreparer
          ? undefined
          : {
              width: documentField.width as number,
              height: documentField.height as number,
            };

      const pageOffset =
        (greaterWidthMetadata.width - pdfMeta[documentField.pageNumber].width) / 2 + 12 ||
        0;

      const updatedField = {
        ...documentField,
        style: {
          ...documentField.style,
          ...sizeStyles,
          maxWidth: pdfMeta[documentField.pageNumber].width,
          maxHeight: pdfMeta[documentField.pageNumber].height,
          left: documentField.coordinateX + pageOffset,
          top: documentField.coordinateY,
          fontFamily: documentField.fontFamily || undefined,
          fontSize: documentField.fontSize ? documentField.fontSize : undefined,
        },
      };

      updateDocumentFieldLocally(updatedField);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateDocumentFieldLocally, pagesContainerRef.current],
  );

  useEffect(() => {
    if (pagesContainerRef.current) {
      documentFields.forEach(calculateDocumentFieldStyles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesContainerRef.current, calculateDocumentFieldStyles]);

  if (isCheckingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  return (
    <div className="documentPreview__wrapper">
      <div
        className={classNames('documentPreview__document-wrapper', { mobile: isMobile })}
      >
        <div
          className={classNames('documentPreview__document-inner', { mobile: isMobile })}
        >
          <header
            className={classNames('documentPreview__document-header', {
              mobile: isMobile,
            })}
          >
            {isMobile ? (
              <div className="documentPreview__document-header-right">
                <div className="documentPreview__document-header-button-wrapper mobile">
                  <HeaderButton
                    icon={DownloadIcon}
                    onClick={handleDocumentDownload}
                    disabled={isDownloadingDocument}
                    isLoading={isDownloadingDocument}
                    iconType="fill"
                    isMobile
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="documentPreview__document-header-title">Document Preview</p>
                <div className="documentPreview__document-header-right">
                  <div className="documentPreview__document-header-button-wrapper">
                    <HeaderButton
                      title="Download"
                      icon={DownloadIcon}
                      onClick={handleDocumentDownload}
                      disabled={isDownloadingDocument}
                      isLoading={isDownloadingDocument}
                      iconType="fill"
                    />
                    <HeaderButton
                      title="Print"
                      icon={PrintIcon}
                      onClick={printPdf}
                      disabled={isPdfLoading}
                      isLoading={isPdfLoading}
                    />
                  </div>
                  <UIButton
                    priority="primary"
                    title="Back to Documents"
                    handleClick={() => History.push('/documents')}
                  />
                </div>
              </>
            )}
          </header>
          {isDocumentInteractInitializing ? (
            <div className="documentPreview__spinner">
              <UISpinner
                width={50}
                height={50}
                wrapperClassName="spinner--main__wrapper"
              />
            </div>
          ) : (
            <div
              ref={pagesContainerRef}
              className={classNames('documentPreview__document-container', {
                mobile: isMobile,
              })}
            >
              {pages.map((page, pageNumber) => (
                <DocumentPreviewPage
                  scale={documentScale}
                  key={pageNumber}
                  page={page}
                  style={{
                    marginBottom: sizes.pageMarginBottom,
                    ...pdfMeta[pageNumber + 1],
                  }}
                  onLoad={decreasePagesInLoadingCount}
                >
                  {currentDocument?.status !== DocumentStatuses.COMPLETED &&
                    documentFields
                      .filter(field => field.pageNumber - 1 === pageNumber)
                      .map(field => (
                        <FieldItem
                          documentScale={documentScale}
                          key={field.id}
                          field={field}
                          disabled
                          onChangeSigner={() => {}}
                          isResizable={false}
                        />
                      ))}
                </DocumentPreviewPage>
              ))}
            </div>
          )}
        </div>
      </div>
      {documentId && <DocumentActivityList documentId={documentId} />}
    </div>
  );
};

export default DocumentPreview;
