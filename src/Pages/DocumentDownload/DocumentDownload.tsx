import React, { useMemo, useEffect, useCallback } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { Document, DocumentDownloadPayload, Signer } from 'Interfaces/Document';
import { useDocumentDownload } from 'Hooks/Document';
import Toast from 'Services/Toast';
import History from 'Services/History';

import UISpinner from 'Components/UIComponents/UISpinner';

interface PageParams {
  documentId: Document['id'];
  signerId?: Signer['id'];
}

export const DocumentDownload = ({ location, match }: RouteChildrenProps<PageParams>) => {
  const [downloadDocument, isDownloading, isReady] = useDocumentDownload();

  const handleDocumentDownload = useCallback(
    async (payload: DocumentDownloadPayload) => {
      try {
        await downloadDocument(payload);
      } catch (err) {
        Toast.handleErrors(err);
      } finally {
        History.replace('/');
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

  useEffect(() => {
    if (hash && documentId && isReady) {
      handleDocumentDownload({
        hash,
        documentId,
        signerId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, documentId, isReady]);

  return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
};
