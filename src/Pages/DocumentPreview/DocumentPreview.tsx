import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { Document, DocumentDownloadTypes, DocumentStatuses } from 'Interfaces/Document';
import { DocumentField } from 'Interfaces/DocumentFields';
import {
  useDocumentInteractInit,
  useDocumentGuard,
  useDocumentPrint,
  useDocumentDownload,
} from 'Hooks/Document';
import { useDocumentFieldUpdateLocally } from 'Hooks/DocumentFields';
import { selectDocumentFields, selectDocument } from 'Utils/selectors';
import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import FieldItem from 'Components/Interact/components/FieldItem';
import DownloadIcon from 'Assets/images/icons/doc-download-icon.svg';
import PrintIcon from 'Assets/images/icons/print-icon.svg';
import DocumentActivityList from './components/DocumentActivityList';
import { DocumentPreviewPage } from 'Components/DocumentPage';
import { PDFDocument } from 'Components/PDFDocument';
import HeaderButton from './components/HeaderButton';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import useDocumentActivitiesDownload from 'Hooks/Document/useDocumentActivitiesDownload';
import useGetPdfMetadataFromDocumentPart from 'Hooks/Document/useGetPdfMetadataFromDocumentPart';
import DocumentFileKeyExtractor from 'Pages/Documents/DocumentFileKeyExtractor';
import { useDownloadFiles, useIsTablet } from 'Hooks/Common';
import useDocumentSeparateDownload from 'Hooks/Document/useDocumentSeparateDownload';
import useDocumentActivitiesSeparateSign from 'Hooks/Document/useDocumentActivitiesSeparateSign';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import ScaleDropDown from 'Components/Interact/components/ScaleDropDown';
import { pdfjs } from 'react-pdf';

interface DocumentParams {
  documentId: Document['id'];
}

const sizes = {
  pageContainerWidth: window.innerWidth < 768 ? window.innerWidth : 955,
  pageMarginBottom: 20,
};

const DocumentPreview = ({ match }: RouteChildrenProps<DocumentParams>) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const documentId = useMemo(() => match?.params.documentId, [match]);
  const currentDocument = useSelector(state => selectDocument(state, { documentId }));
  const [, documentFileKeyExtractorForDocument] = DocumentFileKeyExtractor();
  const [downloadDocuments] = useDownloadFiles<Document>({
    fileExtractors: [documentFileKeyExtractorForDocument],
  });
  const isDownloadEnable = useMemo(
    () =>
      !!currentDocument &&
      (!!currentDocument?.resultPdfFileKey ||
        currentDocument.parts.filter(x => x.filesUploaded).length > 0),
    [currentDocument],
  );
  const isPrintEnable = useMemo(
    () =>
      currentDocument?.status !== DocumentStatuses.DRAFT &&
      (!!currentDocument?.resultPdfFileKey ||
        !!currentDocument?.resultDocumentPdfFileKey),
    [currentDocument],
  );

  const [downloadSeparateDocument] = useDocumentSeparateDownload();
  const [, isSigningSeparateDocumentActivities] = useDocumentActivitiesSeparateSign();
  const [downloadDocumentActivities] = useDocumentActivitiesDownload();
  const [downloadDocument, isDownloadingDocument] = useDocumentDownload();
  const [printPdf, isPdfLoading] = useDocumentPrint(currentDocument as Document);
  const [
    initDocumentInteract,
    isDocumentInteractInitializing,
  ] = useDocumentInteractInit();
  const documentFields: DocumentField[] = useSelector(selectDocumentFields);

  const [pdfUrl, setPdfUrl] = useState<string[] | undefined>();

  const [pages, setPages] = useState<{ [key: string]: number }>({});
  let countOfPages = 0;

  const mainRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const getPdfMetadata = useGetPdfMetadataFromDocumentPart(currentDocument as Document);
  const pdfMeta = useMemo(
    () =>
      currentDocument?.pdfMetadata ? currentDocument?.pdfMetadata : getPdfMetadata(),
    [currentDocument, getPdfMetadata],
  );
  const isDownloadActivitiesEnable = useMemo(() => {
    return (
      !!documentId &&
      currentDocument?.status === DocumentStatuses.COMPLETED &&
      !!currentDocument?.resultActivitiesPdfFileKey &&
      currentDocument?.downloadType === DocumentDownloadTypes.SEPARATED
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, currentDocument, !!currentDocument?.resultActivitiesPdfFileKey]);

  const greaterWidthMetadata = useMemo(() => {
    return Object.values(pdfMeta).reduce(
      (greaterWidth, pageMetadata) => {
        return greaterWidth.width < pageMetadata.width ? pageMetadata : greaterWidth;
      },
      { width: 0 },
    );
  }, [pdfMeta]);

  const contentWidth = pagesContainerRef.current?.clientWidth || 0;

  const [documentScale, setDocumentScale] = useState(1);
  const [, setPagesInLoadingCount] = useState(0);

  const [offset, setOffset] = useState(0);

  const [scaleCoefficient, setScaleCoefficient] = useState(
    isMobile || isTablet ? 0.5 : 1,
  );

  const onScaleChange = (scale: number) => {
    setScaleCoefficient(scale);
  };

  const updateDocumentFieldLocally = useDocumentFieldUpdateLocally();

  const handleDocumentNotFound = useCallback(() => {
    Toast.error('Document does not exist', { toastId: 'document_not_found_error' });
    History.push(AuthorizedRoutePaths.DOCUMENTS);
  }, []);

  const handleSeparateDocumentDownload = useCallback(async () => {
    try {
      if (currentDocument?.id) {
        await downloadSeparateDocument({ documentId: currentDocument.id });
      }
    } catch (err) {
      Toast.handleErrors(err, { toastId: 'separated_download_error' });
    }
  }, [currentDocument, downloadSeparateDocument]);

  const handleDocumentDownload = useCallback(async () => {
    try {
      if (currentDocument?.id && currentDocument.resultPdfFileKey) {
        await downloadDocument({ documentId: currentDocument.id });
      } else if (currentDocument && isDownloadEnable) {
        await downloadDocuments([currentDocument]);
      }
    } catch (err) {
      Toast.handleErrors(err, { toastId: 'download_error' });
    }
  }, [currentDocument, isDownloadEnable, downloadDocument, downloadDocuments]);

  const isCheckingDocument = useDocumentGuard({
    documentId,
    onFailure: handleDocumentNotFound,
  });

  useEffect(() => {
    if (greaterWidthMetadata) {
      setDocumentScale(sizes.pageContainerWidth / greaterWidthMetadata.width);
    }
  }, [greaterWidthMetadata]);

  const handleGetConvertedDocument = useCallback(
    async (currentDocument: Document) => {
      try {
        const [pdfUrls] = await initDocumentInteract({ document: currentDocument });

        setPdfUrl(pdfUrls);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleDocumentActivitiesDownload = useCallback(async () => {
    try {
      if (documentId) {
        await downloadDocumentActivities({ documentId });
      }
    } catch (error) {
      Toast.handleErrors(error, { toastId: 'activities_download_error' });
    }
  }, [documentId, downloadDocumentActivities]);

  useEffect(() => {
    if (currentDocument) {
      handleGetConvertedDocument(currentDocument);
    }
  }, [handleGetConvertedDocument, currentDocument]);

  const calculateDocumentFieldStyles = useCallback(
    (documentField: DocumentField) => {
      const pageOffset =
        (greaterWidthMetadata.width - pdfMeta[documentField.pageNumber].width) / 2;

      const updatedField = {
        ...documentField,
        style: {
          ...documentField.style,
          width: documentField.width as number,
          height: documentField.height as number,
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

  const handlePdfLoadSuccess = useCallback(
    (pdfDocumentProxy: pdfjs.PDFDocumentProxy, fileUrl: string) => {
      setPages(prev => {
        prev[fileUrl] = pdfDocumentProxy.numPages;
        return prev;
      });

      setPagesInLoadingCount(prev => prev + 1);
    },
    [],
  );

  useEffect(() => {
    if (pagesContainerRef.current) {
      documentFields.forEach(calculateDocumentFieldStyles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesContainerRef.current, calculateDocumentFieldStyles]);

  const initialDocumentWidth = greaterWidthMetadata.width * documentScale;

  useEffect(() => {
    const scrollBarWidth = scaleCoefficient < 1 ? initialDocumentWidth - contentWidth : 0;

    const offset =
      (initialDocumentWidth - initialDocumentWidth * scaleCoefficient - scrollBarWidth) /
      2;

    const resultOffset = offset > 0 ? offset : 0;

    setOffset(resultOffset);
  }, [contentWidth, initialDocumentWidth, scaleCoefficient]);

  if (isCheckingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  return (
    <div className="documentPreview__wrapper" ref={mainRef}>
      <div
        className={classNames('documentPreview__document-wrapper', { mobile: isMobile })}
      >
        <div
          className={classNames('documentPreview__document-inner', { mobile: isMobile })}
          style={{ width: initialDocumentWidth }}
        >
          <header
            className={classNames('documentPreview__document-header', {
              mobile: isMobile,
            })}
          >
            {isMobile && isDownloadEnable ? (
              <div className="documentPreview__document-header-right">
                <div className="documentPreview__document-header-button-wrapper mobile">
                  {isDownloadEnable &&
                    currentDocument?.status === DocumentStatuses.COMPLETED && (
                      <HeaderButton
                        title={'Download'}
                        icon={DownloadIcon}
                        onClick={
                          currentDocument.downloadType === DocumentDownloadTypes.SEPARATED
                            ? handleSeparateDocumentDownload
                            : handleDocumentDownload
                        }
                        disabled={isDownloadingDocument}
                        isLoading={isDownloadingDocument}
                        iconType="stroke"
                      />
                    )}
                </div>
              </div>
            ) : (
              <>
                <p className="documentPreview__document-header-title">Document Preview</p>
                <div className="documentPreview__document-header-scale">
                  <ScaleDropDown
                    changeScale={onScaleChange}
                    documentScale={scaleCoefficient}
                  />
                </div>
                <div className="documentPreview__document-header-right">
                  <div className="documentPreview__document-header-button-wrapper">
                    {isDownloadEnable &&
                      currentDocument?.status === DocumentStatuses.COMPLETED && (
                        <HeaderButton
                          title={'Download'}
                          icon={DownloadIcon}
                          onClick={
                            currentDocument.downloadType ===
                            DocumentDownloadTypes.SEPARATED
                              ? handleSeparateDocumentDownload
                              : handleDocumentDownload
                          }
                          disabled={isDownloadingDocument}
                          isLoading={isDownloadingDocument}
                          iconType="stroke"
                        />
                      )}
                    {isPrintEnable && (
                      <HeaderButton
                        title="Print"
                        icon={PrintIcon}
                        onClick={printPdf}
                        disabled={isPdfLoading}
                        isLoading={isPdfLoading}
                      />
                    )}
                  </div>
                  <UIButton
                    priority="primary"
                    title="Back to Documents"
                    handleClick={() => History.push(AuthorizedRoutePaths.DOCUMENTS)}
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
              <div
                style={{
                  width:
                    scaleCoefficient >= 1
                      ? greaterWidthMetadata.width * documentScale * scaleCoefficient
                      : undefined,
                }}
              >
                {pdfUrl &&
                  pdfUrl.map((file, index) => (
                    <PDFDocument
                      key={index}
                      file={file}
                      onLoadSuccess={proxy => handlePdfLoadSuccess(proxy, file)}
                      externalLinkTarget={'_blank'}
                    >
                      {Object.keys(pages).length === pdfUrl.length ? (
                        Array.from({ length: pages[file] }, (_, i) => i + 1).map(
                          (pageNumber, pageIndex) => (
                            <DocumentPreviewPage
                              scale={documentScale * scaleCoefficient}
                              key={index + pageIndex + file + countOfPages}
                              pageNumber={pageNumber}
                              offset={offset}
                              style={{
                                marginBottom: sizes.pageMarginBottom,
                                ...pdfMeta[++countOfPages],
                              }}
                            >
                              {currentDocument?.status !== DocumentStatuses.COMPLETED &&
                                documentFields
                                  .filter(field => field.pageNumber === countOfPages)
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
                          ),
                        )
                      ) : (
                        <>
                          Loading PDF..
                          <br />
                        </>
                      )}
                    </PDFDocument>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {documentId && (
        <DocumentActivityList
          documentId={documentId}
          canDownloadActivities={isDownloadActivitiesEnable}
          handleDocumentActivitiesDownload={handleDocumentActivitiesDownload}
          isDownloading={isSigningSeparateDocumentActivities}
          isDocumentCompleted={currentDocument?.status === DocumentStatuses.COMPLETED}
        />
      )}
    </div>
  );
};

export default DocumentPreview;
