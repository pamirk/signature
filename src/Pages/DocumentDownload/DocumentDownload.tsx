import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import {
  Document,
  DocumentDownloadPayload,
  DocumentDownloadTypes,
  DocumentStatuses,
  Signer,
} from 'Interfaces/Document';
import { useDocumentDownload, useGetDocumentByHash } from 'Hooks/Document';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useDownloadFiles } from 'Hooks/Common';
import DocumentSeparatedFileKeyExtractor from 'Pages/Documents/DocumentSeparatedFileKeyExtractor';
import { isNotEmpty } from '../../Utils/functions';

interface PageParams {
  documentId: Document['id'];
  signerId?: Signer['id'];
}

export const DocumentDownload = ({ location, match }: RouteChildrenProps<PageParams>) => {
  const [documentByHash, setDocumentByHash] = useState<Document>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [downloadDocument, isDownloading, isReady] = useDocumentDownload();

  const [getDocumentByHash] = useGetDocumentByHash();

  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  const handleDocumentDownload = useCallback(
    async (payload: DocumentDownloadPayload) => {
      try {
        await downloadDocument(payload);
      } catch (err) {
        Toast.handleErrors(err, { toastId: 'download_error' });
      } finally {
        History.replace(AuthorizedRoutePaths.BASE_PATH);
      }
    },
    [downloadDocument],
  );

  const { hash, documentId, signerId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const { documentId, signerId } = match?.params || {};

    return {
      hash: searchParams.get('hash'),
      documentId,
      signerId,
    };
  }, [location.search, match]);

  const [
    ,
    documentSeparatedFileKeyExtractorForDocument,
    documentSeparatedFileKeyExtractorForDocumentActivities,
  ] = DocumentSeparatedFileKeyExtractor();

  const [downloadSeparatedDocument, isDownloadingDocuments] = useDownloadFiles<Document>({
    fileExtractors: [
      documentSeparatedFileKeyExtractorForDocument,
      documentSeparatedFileKeyExtractorForDocumentActivities,
    ],
    hash: hash,
    name: documentByHash?.title,
  });

  const handleSeparatedDocumentDownload = useCallback(
    async (doc: Document) => {
      try {
        if ((doc?.id, doc?.resultDocumentPdfFileKey)) {
          await downloadSeparatedDocument([doc]);
        }
      } catch (err) {
        Toast.handleErrors(err, { toastId: 'separated_download_error' });
      } finally {
        navigateToRoot();
      }
    },
    [downloadSeparatedDocument, navigateToRoot],
  );

  const handleDownload = useCallback(async () => {
    try {
      if (hash && documentId && isReady) {
        const doc = await getDocumentByHash({
          documentId,
          hash,
        });
        //@ts-ignore
        setDocumentByHash(doc);
      }
    } catch (err) {
      Toast.handleErrors(err, { toastId: 'download_by_hash_error' });
      navigateToRoot();
    }
  }, [hash, documentId, isReady, getDocumentByHash, navigateToRoot]);

  useEffect(() => {
    handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, documentId, isReady]);

  useEffect(() => {
    if (hash && documentId && isReady && documentByHash) {
      if (
        isNotEmpty(documentByHash) &&
        (documentByHash?.downloadType === DocumentDownloadTypes.MERGED ||
          documentByHash?.status !== DocumentStatuses.COMPLETED)
      ) {
        handleDocumentDownload({
          hash,
          documentId,
          signerId,
        });
      } else {
        //@ts-ignore
        handleSeparatedDocumentDownload(documentByHash);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentByHash]);

  return (
    <>
      {isDownloadingDocuments && (
        <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />
      )}
    </>
  );
};
