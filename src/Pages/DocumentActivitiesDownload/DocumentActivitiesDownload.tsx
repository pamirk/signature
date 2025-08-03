import useDocumentActivitiesDownload from 'Hooks/Document/useDocumentActivitiesDownload';
import { Document, DocumentDownloadPayload } from 'Interfaces/Document';
import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import Toast from 'Services/Toast';
import History from 'Services/History';
import UISpinner from 'Components/UIComponents/UISpinner';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface PageParams {
  documentId: Document['id'];
}

export const DocumentActivitiesDownload = ({
  location,
  match,
}: RouteChildrenProps<PageParams>) => {
  const [
    downloadDocumentActivities,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDownloading,
    isReady,
  ] = useDocumentActivitiesDownload();

  const handleDocumentActivitiesDownload = useCallback(
    async (payload: DocumentDownloadPayload) => {
      try {
        await downloadDocumentActivities(payload);
      } catch (err) {
        Toast.handleErrors(err, { toastId: 'activities_download_error' });
      } finally {
        History.replace(UnauthorizedRoutePaths.BASE_PATH);
      }
    },
    [downloadDocumentActivities],
  );

  const { hash, documentId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const { documentId } = match?.params || {};

    return {
      hash: searchParams.get('hash'),
      documentId,
    };
  }, [location.search, match]);

  useEffect(() => {
    if (hash && documentId && isReady) {
      handleDocumentActivitiesDownload({
        hash,
        documentId,
      });
    }
  }, [hash, documentId, isReady, handleDocumentActivitiesDownload]);

  return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
};
